const express = require('express')
const router = express.Router()
const {
  getAllDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deactivateDriver,
  uploadDocument,
  verifyDocument,
  getDriverStats,
  getMyStats
} = require('../controllers/driver.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/role.middleware')

router.use(authenticate)

router.get('/me/stats', authorize('driver'), getMyStats)
router.get('/', authorize('admin', 'manager'), getAllDrivers)
router.get('/:id', authorize('admin', 'manager'), getDriver)
router.post('/', authorize('admin', 'manager'), createDriver)
router.put('/:id', authorize('admin', 'manager'), updateDriver)
router.delete('/:id', authorize('admin'), deactivateDriver)
router.post('/:id/documents', authorize('admin', 'manager'), uploadDocument)
router.put('/:id/documents/:docId/verify', authorize('admin'), verifyDocument)
router.get('/:id/stats', authorize('admin', 'manager'), getDriverStats)

module.exports = router