const express = require('express')
const router = express.Router()
const {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  assignOrder,
  updateStatus,
  failOrder,
  cancelOrder,
  getMyOrders,
  trackOrder
} = require('../controllers/order.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/role.middleware')

const SupplyChainEvent = require('../models/SupplyChainEvent.model')

// Timeline routes
router.get('/:id/timeline', authenticate, async (req, res) => {
  try {
    const events = await SupplyChainEvent.find({
      deliveryOrderId: req.params.id
    }).sort({ timestamp: 1 })
    res.json({ success: true, events })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/:id/timeline', authenticate, authorize('admin', 'manager'), async (req, res) => {
  try {
    const event = await SupplyChainEvent.create({
      deliveryOrderId: req.params.id,
      ...req.body,
      updatedBy: req.user._id
    })
    res.status(201).json({ success: true, event })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Public route — no auth
router.get('/track/:orderNo', trackOrder)

router.use(authenticate)

router.get('/driver/me', authorize('driver', 'admin', 'manager'), getMyOrders)
router.get('/', authorize('admin', 'manager'), getAllOrders)
router.get('/:id', authorize('admin', 'manager', 'driver'), getOrder)
router.post('/', authorize('admin', 'manager'), createOrder)
router.put('/:id', authorize('admin', 'manager'), updateOrder)
router.put('/:id/assign', authorize('admin', 'manager'), assignOrder)
router.put('/:id/status', authorize('admin', 'manager', 'driver'), updateStatus)
router.put('/:id/fail', authorize('admin', 'manager', 'driver'), failOrder)
router.put('/:id/cancel', authorize('admin', 'manager'), cancelOrder)

module.exports = router