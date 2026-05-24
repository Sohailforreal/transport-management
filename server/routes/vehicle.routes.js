const express = require('express')
const router = express.Router()
const {
  getAllVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deactivateVehicle,
  updateInsurance,
  updatePuc,
  addMaintenance,
  getExpiryAlerts
} = require('../controllers/vehicle.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/role.middleware')

router.use(authenticate)

router.get('/alerts/expiry', authorize('admin', 'manager'), getExpiryAlerts)
router.get('/', authorize('admin', 'manager'), getAllVehicles)
router.get('/:id', authorize('admin', 'manager'), getVehicle)
router.post('/', authorize('admin', 'manager'), createVehicle)
router.put('/:id', authorize('admin', 'manager'), updateVehicle)
router.delete('/:id', authorize('admin'), deactivateVehicle)
router.post('/:id/insurance', authorize('admin', 'manager'), updateInsurance)
router.post('/:id/puc', authorize('admin', 'manager'), updatePuc)
router.post('/:id/maintenance', authorize('admin', 'manager'), addMaintenance)

module.exports = router