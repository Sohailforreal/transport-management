const Driver = require('../models/Driver.model')
const User = require('../models/User.model')
const Order = require('../models/Order.model')

// @route GET /api/drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ isActive: true })
      .populate('userId', 'name email phone photo')
      .populate('assignedVehicleId', 'registrationNo type')
    res.json({ success: true, drivers })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/drivers/:id
exports.getDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate('userId', 'name email phone photo')
      .populate('assignedVehicleId', 'registrationNo type')
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' })
    }
    res.json({ success: true, driver })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route POST /api/drivers
exports.createDriver = async (req, res) => {
  try {
    const {
      name, email, password, phone,
      licenseNo, licenseExpiry, assignedVehicleId
    } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    // Generate employeeId
    const count = await Driver.countDocuments()
    const employeeId = `DRV${String(count + 1).padStart(3, '0')}`
    const defaultPassword = employeeId

    const user = await User.create({
      name, email,
      password: defaultPassword,
      phone,
      role: 'driver'
    })

    const driver = await Driver.create({
      userId: user._id,
      employeeId,
      licenseNo,
      licenseExpiry,
      assignedVehicleId: assignedVehicleId || null,
      mustChangePassword: true
    })

    const populatedDriver = await Driver.findById(driver._id)
      .populate('userId', 'name email phone photo')
      .populate('assignedVehicleId', 'registrationNo type')

    res.status(201).json({
      success: true,
      driver: populatedDriver,
      credentials: {
        loginId: email,
        password: defaultPassword
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route PUT /api/drivers/:id
exports.updateDriver = async (req, res) => {
  try {
    const { name, phone, licenseNo, licenseExpiry, assignedVehicleId, status } = req.body

    const driver = await Driver.findById(req.params.id)
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' })
    }

    // Update user info
    if (name || phone) {
      await User.findByIdAndUpdate(driver.userId, { name, phone })
    }

    // Update driver info
    const updated = await Driver.findByIdAndUpdate(
      req.params.id,
      { licenseNo, licenseExpiry, assignedVehicleId, status },
      { new: true }
    ).populate('userId', 'name email phone photo')
     .populate('assignedVehicleId', 'registrationNo type')

    res.json({ success: true, driver: updated })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route DELETE /api/drivers/:id
exports.deactivateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' })
    }
    await User.findByIdAndUpdate(driver.userId, { isActive: false })
    res.json({ success: true, message: 'Driver deactivated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route POST /api/drivers/:id/documents
exports.uploadDocument = async (req, res) => {
  try {
    const { docType, fileUrl } = req.body
    const driver = await Driver.findById(req.params.id)
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' })
    }

    // Remove existing doc of same type
    driver.documents = driver.documents.filter(d => d.docType !== docType)
    driver.documents.push({ docType, fileUrl, uploadedAt: new Date() })
    await driver.save()

    res.json({ success: true, driver })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route PUT /api/drivers/:id/documents/:docId/verify
exports.verifyDocument = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' })
    }

    const doc = driver.documents.id(req.params.docId)
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' })
    }

    doc.verified = true
    await driver.save()

    res.json({ success: true, driver })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/drivers/:id/stats
exports.getDriverStats = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' })
    }

    const stats = await Order.aggregate([
      { $match: { driverId: driver._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          delivered: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ])

    const data = stats[0] || { total: 0, delivered: 0, failed: 0, cancelled: 0 }
    const successRate = data.total > 0
      ? ((data.delivered / data.total) * 100).toFixed(1)
      : 0

    // This month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const thisMonth = await Order.countDocuments({
      driverId: driver._id,
      createdAt: { $gte: startOfMonth }
    })

    res.json({
      success: true,
      stats: { ...data, successRate, thisMonth }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/drivers/me/stats
exports.getMyStats = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.user._id })
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' })
    }
    req.params.id = driver._id
    exports.getDriverStats(req, res)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}