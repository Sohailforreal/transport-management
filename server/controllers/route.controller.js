const Route = require('../models/Route.model')

exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find({ isActive: true })
    res.json({ success: true, routes })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)
    if (!route) return res.status(404).json({ message: 'Route not found' })
    res.json({ success: true, route })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createRoute = async (req, res) => {
  try {
    const route = await Route.create(req.body)
    res.status(201).json({ success: true, route })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!route) return res.status(404).json({ message: 'Route not found' })
    res.json({ success: true, route })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deactivateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )
    if (!route) return res.status(404).json({ message: 'Route not found' })
    res.json({ success: true, message: 'Route deactivated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}