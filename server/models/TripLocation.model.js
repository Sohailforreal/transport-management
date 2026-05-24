const mongoose = require('mongoose')

const tripLocationSchema = new mongoose.Schema({
  deliveryOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  lastLocation: {
    lat: Number,
    lng: Number,
    updatedAt: Date
  },
  isLive: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('TripLocation', tripLocationSchema)