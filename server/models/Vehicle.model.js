const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({
  registrationNo: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    enum: ['truck', 'mini', 'tempo'],
    required: true
  },
  capacityTons: {
    type: Number,
    required: true
  },
  photo: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['available', 'ontrip', 'maintenance'],
    default: 'available'
  },
  insurance: {
    provider: String,
    policyNo: String,
    expiryDate: Date,
    documentUrl: String
  },
  puc: {
    certNo: String,
    expiryDate: Date,
    documentUrl: String
  },
  maintenanceLog: [{
    date: Date,
    description: String,
    cost: Number,
    nextDueDate: Date,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Vehicle', vehicleSchema)