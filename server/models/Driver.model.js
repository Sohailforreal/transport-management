const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: {
    type: String,
    unique: true,
    trim: true
  },
  licenseNo: {
    type: String,
    required: [true, 'License number is required'],
    trim: true
  },
  licenseExpiry: {
    type: Date,
    required: [true, 'License expiry is required']
  },
  documents: [{
    docType: {
      type: String,
      enum: ['aadhaar', 'license']
    },
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  assignedVehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    default: null
  },
  status: {
    type: String,
    enum: ['available', 'onduty', 'off'],
    default: 'available'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

// Auto generate employeeId
driverSchema.pre('save', async function() {
  if (this.employeeId) return
  const count = await mongoose.model('Driver').countDocuments()
  this.employeeId = `DRV${String(count + 1).padStart(3, '0')}`
})

module.exports = mongoose.model('Driver', driverSchema)