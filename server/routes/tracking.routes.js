const express = require('express')
const router = express.Router()
const TripLocation = require('../models/TripLocation.model')
const Driver = require('../models/Driver.model')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/role.middleware')

router.use(authenticate)

// Driver starts sharing location
router.post('/:orderId/start', authorize('driver'), async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.user._id })
    let trip = await TripLocation.findOne({ deliveryOrderId: req.params.orderId })
    if (!trip) {
      trip = await TripLocation.create({
        deliveryOrderId: req.params.orderId,
        driverId: driver._id,
        isLive: true
      })
    } else {
      trip.isLive = true
      await trip.save()
    }
    res.json({ success: true, trip })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Driver updates location
router.put('/:orderId/location', authorize('driver'), async (req, res) => {
  try {
    const { lat, lng } = req.body
    const trip = await TripLocation.findOneAndUpdate(
      { deliveryOrderId: req.params.orderId },
      { lastLocation: { lat, lng, updatedAt: new Date() } },
      { new: true }
    )
    res.json({ success: true, trip })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Driver stops sharing
router.post('/:orderId/stop', authorize('driver'), async (req, res) => {
  try {
    const trip = await TripLocation.findOneAndUpdate(
      { deliveryOrderId: req.params.orderId },
      { isLive: false },
      { new: true }
    )
    res.json({ success: true, trip })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get last known location
router.get('/:orderId', async (req, res) => {
  try {
    const trip = await TripLocation.findOne({
      deliveryOrderId: req.params.orderId
    })
    res.json({ success: true, trip })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router