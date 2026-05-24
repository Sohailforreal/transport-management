const Order = require('../models/Order.model')
const Driver = require('../models/Driver.model')
const Vehicle = require('../models/Vehicle.model')
const SupplyChainEvent = require('../models/SupplyChainEvent.model')

const populate = (query) => query
  .populate('routeId', 'name source destination checkpoints distanceKm estimatedHours')
  .populate('vehicleId', 'registrationNo type')
  .populate('driverId')
  .populate({ path: 'driverId', populate: { path: 'userId', select: 'name phone' } })
  .populate('createdBy', 'name')

// @route GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const filter = { }
    if (req.query.status) filter.status = req.query.status
    const orders = await populate(Order.find(filter).sort({ createdAt: -1 }))
    res.json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await populate(Order.findById(req.params.id))
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      createdBy: req.user._id
    })

    // Create first supply chain event
    await SupplyChainEvent.create({
      deliveryOrderId: order._id,
      eventType: 'ordered',
      location: req.body.pickupAddress,
      description: 'Order created',
      updatedBy: req.user._id
    })

    res.status(201).json({ success: true, order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route PUT /api/orders/:id
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route PUT /api/orders/:id/assign
exports.assignOrder = async (req, res) => {
  try {
    const { vehicleId, driverId } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { vehicleId, driverId },
      { new: true }
    )
    if (!order) return res.status(404).json({ message: 'Order not found' })

    // Update vehicle and driver status
    await Vehicle.findByIdAndUpdate(vehicleId, { status: 'ontrip' })
    await Driver.findByIdAndUpdate(driverId, { status: 'onduty' })

    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route PUT /api/orders/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status, location, description } = req.body
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    order.status = status
    if (status === 'delivered') {
      order.actualDeliveryDate = new Date()
      // Free up vehicle and driver
      await Vehicle.findByIdAndUpdate(order.vehicleId, { status: 'available' })
      await Driver.findByIdAndUpdate(order.driverId, { status: 'available' })
    }
    await order.save()

    // Add supply chain event
    await SupplyChainEvent.create({
      deliveryOrderId: order._id,
      eventType: status === 'intransit' ? 'checkpoint_reached' : status,
      location: location || '',
      description: description || '',
      updatedBy: req.user._id
    })

    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route PUT /api/orders/:id/fail
exports.failOrder = async (req, res) => {
  try {
    const { reason, description, internalNote, reAttempt } = req.body
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    order.status = 'failed'
    order.failureDetails = {
      reason,
      description,
      internalNote,
      reAttempt,
      failedBy: req.user._id,
      failedAt: new Date()
    }
    await order.save()

    // Free up vehicle and driver
    await Vehicle.findByIdAndUpdate(order.vehicleId, { status: 'available' })
    await Driver.findByIdAndUpdate(order.driverId, { status: 'available' })

    // Add supply chain event
    await SupplyChainEvent.create({
      deliveryOrderId: order._id,
      eventType: 'failed',
      location: '',
      description: `Failed: ${reason}`,
      updatedBy: req.user._id
    })

    // Create reattempt order if needed
    if (reAttempt) {
      const newOrder = await Order.create({
        clientName: order.clientName,
        clientPhone: order.clientPhone,
        pickupAddress: order.pickupAddress,
        deliveryAddress: order.deliveryAddress,
        routeId: order.routeId,
        goods: order.goods,
        createdBy: req.user._id
      })

      order.failureDetails.reAttemptOrderId = newOrder._id
      await order.save()

      await SupplyChainEvent.create({
        deliveryOrderId: newOrder._id,
        eventType: 'ordered',
        location: order.pickupAddress,
        description: `Re-attempt of ${order.orderNo}`,
        updatedBy: req.user._id
      })
    }

    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    order.status = 'cancelled'
    await order.save()

    if (order.vehicleId) {
      await Vehicle.findByIdAndUpdate(order.vehicleId, { status: 'available' })
    }
    if (order.driverId) {
      await Driver.findByIdAndUpdate(order.driverId, { status: 'available' })
    }

    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/orders/driver/me
exports.getMyOrders = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.user._id })
    if (!driver) return res.status(404).json({ message: 'Driver not found' })

    const orders = await populate(
      Order.find({ driverId: driver._id }).sort({ createdAt: -1 })
    )
    res.json({ success: true, orders })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /track/:orderNo — public
exports.trackOrder = async (req, res) => {
  try {
    const order = await populate(
      Order.findOne({ orderNo: req.params.orderNo })
    )
    if (!order) return res.status(404).json({ message: 'Order not found' })

    const timeline = await SupplyChainEvent.find({
      deliveryOrderId: order._id
    }).sort({ timestamp: 1 })

    const driverUser = order.driverId?.userId
    res.json({
      success: true,
      order: {
        orderNo: order.orderNo,
        status: order.status,
        clientName: order.clientName,
        pickupAddress: order.pickupAddress,
        deliveryAddress: order.deliveryAddress,
        scheduledDate: order.scheduledDate,
        estimatedArrival: order.estimatedArrival,
        actualDeliveryDate: order.actualDeliveryDate,
        route: order.routeId
      },
      driver: driverUser ? {
        name: driverUser.name,
        phone: driverUser.phone
      } : null,
      timeline
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}