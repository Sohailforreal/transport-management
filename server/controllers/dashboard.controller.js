const Order = require('../models/Order.model')
const Vehicle = require('../models/Vehicle.model')
const Driver = require('../models/Driver.model')

exports.getAdminDashboard = async (req, res) => {
  try {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    const in15Days = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)

    // Order stats
    const [
      totalOrders, pendingOrders, dispatchedOrders,
      intransitOrders, deliveredOrders, failedOrders,
      cancelledOrders, thisMonthOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'dispatched' }),
      Order.countDocuments({ status: 'intransit' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'failed' }),
      Order.countDocuments({ status: 'cancelled' }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } })
    ])

    // Vehicle stats
    const [totalVehicles, availableVehicles, onTripVehicles, maintenanceVehicles] =
      await Promise.all([
        Vehicle.countDocuments({ isActive: true }),
        Vehicle.countDocuments({ isActive: true, status: 'available' }),
        Vehicle.countDocuments({ isActive: true, status: 'ontrip' }),
        Vehicle.countDocuments({ isActive: true, status: 'maintenance' })
      ])

    // Driver stats
    const [totalDrivers, availableDrivers, onDutyDrivers] = await Promise.all([
      Driver.countDocuments({ isActive: true }),
      Driver.countDocuments({ isActive: true, status: 'available' }),
      Driver.countDocuments({ isActive: true, status: 'onduty' })
    ])

    // Failure reasons breakdown
    const failureBreakdown = await Order.aggregate([
      { $match: { status: 'failed' } },
      { $group: { _id: '$failureDetails.reason', count: { $sum: 1 } } }
    ])

    // Monthly delivery trend (last 6 months)
    const monthlyTrend = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(today.getFullYear(), today.getMonth() - 5, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          total: { $sum: 1 },
          delivered: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    // Expiry alerts
    const vehicles = await Vehicle.find({ isActive: true })
    const expiryAlerts = []
    vehicles.forEach(v => {
      if (v.insurance?.expiryDate && v.insurance.expiryDate <= in30Days) {
        expiryAlerts.push({
          type: 'insurance',
          vehicleNo: v.registrationNo,
          expiryDate: v.insurance.expiryDate
        })
      }
      if (v.puc?.expiryDate && v.puc.expiryDate <= in15Days) {
        expiryAlerts.push({
          type: 'puc',
          vehicleNo: v.registrationNo,
          expiryDate: v.puc.expiryDate
        })
      }
    })

    // License expiry alerts
    const drivers = await Driver.find({ isActive: true })
    drivers.forEach(d => {
      if (d.licenseExpiry && d.licenseExpiry <= in30Days) {
        expiryAlerts.push({
          type: 'license',
          driverId: d.employeeId,
          expiryDate: d.licenseExpiry
        })
      }
    })

    res.json({
      success: true,
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        dispatched: dispatchedOrders,
        intransit: intransitOrders,
        delivered: deliveredOrders,
        failed: failedOrders,
        cancelled: cancelledOrders,
        thisMonth: thisMonthOrders
      },
      vehicles: {
        total: totalVehicles,
        available: availableVehicles,
        onTrip: onTripVehicles,
        maintenance: maintenanceVehicles
      },
      drivers: {
        total: totalDrivers,
        available: availableDrivers,
        onDuty: onDutyDrivers
      },
      failureBreakdown,
      monthlyTrend,
      expiryAlerts
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getManagerDashboard = async (req, res) => {
  try {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const [
      totalOrders, pendingOrders, intransitOrders,
      deliveredOrders, failedOrders, thisMonthOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'intransit' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'failed' }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } })
    ])

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('driverId')
      .populate({ path: 'driverId', populate: { path: 'userId', select: 'name' } })

    res.json({
      success: true,
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        intransit: intransitOrders,
        delivered: deliveredOrders,
        failed: failedOrders,
        thisMonth: thisMonthOrders
      },
      recentOrders
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getDriverDashboard = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.user._id })
    if (!driver) return res.status(404).json({ message: 'Driver not found' })

    const [total, delivered, failed, active] = await Promise.all([
      Order.countDocuments({ driverId: driver._id }),
      Order.countDocuments({ driverId: driver._id, status: 'delivered' }),
      Order.countDocuments({ driverId: driver._id, status: 'failed' }),
      Order.findOne({
        driverId: driver._id,
        status: { $in: ['dispatched', 'intransit'] }
      }).populate('routeId')
    ])

    const successRate = total > 0
      ? ((delivered / total) * 100).toFixed(1)
      : 0

    res.json({
      success: true,
      stats: { total, delivered, failed, successRate },
      activeOrder: active
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}