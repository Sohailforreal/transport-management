const Vehicle = require('../models/Vehicle.model')

// @route GET /api/vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ isActive: true })
    res.json({ success: true, vehicles })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/vehicles/:id
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }
    res.json({ success: true, vehicle })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route POST /api/vehicles
exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body)
    res.status(201).json({ success: true, vehicle })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route PUT /api/vehicles/:id
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }
    res.json({ success: true, vehicle })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route DELETE /api/vehicles/:id
exports.deactivateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }
    res.json({ success: true, message: 'Vehicle deactivated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route POST /api/vehicles/:id/insurance
exports.updateInsurance = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { insurance: req.body },
      { new: true }
    )
    res.json({ success: true, vehicle })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route POST /api/vehicles/:id/puc
exports.updatePuc = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { puc: req.body },
      { new: true }
    )
    res.json({ success: true, vehicle })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route POST /api/vehicles/:id/maintenance
exports.addMaintenance = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }
    vehicle.maintenanceLog.push({
      ...req.body,
      updatedBy: req.user._id
    })
    await vehicle.save()
    res.json({ success: true, vehicle })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route GET /api/vehicles/alerts/expiry
exports.getExpiryAlerts = async (req, res) => {
  try {
    const today = new Date()
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    const in15Days = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)

    const vehicles = await Vehicle.find({ isActive: true })

    const alerts = []

    vehicles.forEach(v => {
      if (v.insurance?.expiryDate && v.insurance.expiryDate <= in30Days) {
        alerts.push({
          vehicleId: v._id,
          registrationNo: v.registrationNo,
          type: 'insurance',
          expiryDate: v.insurance.expiryDate,
          message: `Insurance expiring on ${v.insurance.expiryDate.toDateString()}`
        })
      }
      if (v.puc?.expiryDate && v.puc.expiryDate <= in15Days) {
        alerts.push({
          vehicleId: v._id,
          registrationNo: v.registrationNo,
          type: 'puc',
          expiryDate: v.puc.expiryDate,
          message: `PUC expiring on ${v.puc.expiryDate.toDateString()}`
        })
      }
    })

    res.json({ success: true, alerts })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}