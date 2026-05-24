const mongoose = require('mongoose')

const supplyChainEventSchema = new mongoose.Schema({
  deliveryOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  eventType: {
    type: String,
    enum: ['ordered','packed','dispatched','checkpoint_reached','delivered','failed'],
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('SupplyChainEvent', supplyChainEventSchema)