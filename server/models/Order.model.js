const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  orderNo: { type: String, unique: true },
  clientName: String,
  clientPhone: String,
  pickupAddress: String,
  deliveryAddress: String,
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  goods: { description: String, weightTons: Number },
  scheduledDate: Date,
  actualDeliveryDate: Date,
  estimatedArrival: Date,
  status: {
    type: String,
    enum: ['pending','dispatched','intransit','delivered','failed','cancelled'],
    default: 'pending'
  },
  fuelLog: { litres: Number, costPerLitre: Number, totalCost: Number },
  failureDetails: {
    reason: String,
    description: String,
    failedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    failedAt: Date,
    internalNote: String,
    reAttempt: Boolean,
    reAttemptOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)