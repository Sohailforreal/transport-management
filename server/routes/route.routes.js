const express = require('express')
const router = express.Router()
const {
  getAllRoutes,
  getRoute,
  createRoute,
  updateRoute,
  deactivateRoute
} = require('../controllers/route.controller')
const { authenticate } = require('../middleware/auth.middleware')
const { authorize } = require('../middleware/role.middleware')

router.use(authenticate)

router.get('/', authorize('admin', 'manager', 'driver'), getAllRoutes)
router.get('/:id', authorize('admin', 'manager', 'driver'), getRoute)
router.post('/', authorize('admin', 'manager'), createRoute)
router.put('/:id', authorize('admin', 'manager'), updateRoute)
router.delete('/:id', authorize('admin'), deactivateRoute)

module.exports = router