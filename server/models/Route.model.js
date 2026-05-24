const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Route name is required'],
    trim: true
  },
  source: {
    type: String,
    required: [true, 'Source is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  distanceKm: {
    type: Number,
    required: true
  },
  estimatedHours: {
    type: Number,
    required: true
  },
  checkpoints: [{
    name: String,
    order: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Route', routeSchema)