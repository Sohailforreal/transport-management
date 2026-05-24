const express = require('express')
const router = express.Router()
const {
  getAdminDashboard,
  getManagerDashboard,
  getDriverDashboard
} = require('../controllers/dashboard.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/role.middleware')

router.use(authenticate)

router.get('/admin', authorize('admin'), getAdminDashboard)
router.get('/manager', authorize('admin', 'manager'), getManagerDashboard)
router.get('/driver', authorize('driver'), getDriverDashboard)

module.exports = router