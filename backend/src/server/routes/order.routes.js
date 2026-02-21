import { Router } from 'express'
import { param, body } from 'express-validator'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { runValidation } from '../middleware/validate.js'
import { placeOrder, getMyOrders, getOrderById, adminGetAllOrders, adminUpdateOrderStatus, cancelOrder } from '../controllers/order.controller.js'

const router = Router()

router.use(requireAuth)

router.get('/admin/all', requireAdmin, adminGetAllOrders)
router.put('/admin/:id', requireAdmin, runValidation([param('id').isMongoId(), body('status').isString()]), adminUpdateOrderStatus)

router.post('/', runValidation([body('shippingAddress').optional().isObject()]), placeOrder)
router.get('/', getMyOrders)
router.get('/:id', runValidation([param('id').isMongoId()]), getOrderById)
router.patch('/:id/cancel', runValidation([param('id').isMongoId()]), cancelOrder)

export default router

