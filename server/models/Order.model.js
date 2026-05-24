const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  orderNo: {
    type: String,
    unique: true
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  clientPhone: {
    type: String,
    required: [true, 'Client phone is required'],
    trim: true
  },
  pickupAddress: {
    type: String,
    required: [true, 'Pickup address is required']
  },
  deliveryAddress: {
    type: String,
    required: [true, 'Delivery address is required']
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  goods: {
    description: String,
    weightTons: Number
  },
  scheduledDate: Date,
  actualDeliveryDate: Date,
  estimatedArrival: Date,
  status: {
    type: String,
    enum: ['pending','dispatched','intransit','delivered','failed','cancelled'],
    default: 'pending'
  },
  fuelLog: {
    litres: Number,
    costPerLitre: Number,
    totalCost: Number
  },
  failureDetails: {
    reason: {
      type: String,
      enum: ['customer_unavailable','wrong_address','goods_damaged','vehicle_breakdown','other']
    },
    description: String,
    failedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    failedAt: Date,
    internalNote: String,
    reAttempt: Boolean,
    reAttemptOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true })

// Auto generate orderNo
orderSchema.pre('save', async function() {
  if (this.orderNo) return
  const count = await mongoose.model('Order').countDocuments()
  this.orderNo = `DEL${String(count + 1).padStart(3, '0')}`
})

module.exports = mongoose.model('Order', orderSchema)