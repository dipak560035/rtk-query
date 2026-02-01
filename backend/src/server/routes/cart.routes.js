import { Router } from 'express'
import { body, param } from 'express-validator'
import { runValidation } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cart.controller.js'

const router = Router()
router.use(requireAuth)

router.get('/', getCart)
router.post('/add', runValidation([body('productId').isMongoId(), body('qty').optional().isInt({ min: 1 })]), addToCart)
router.put('/update', runValidation([body('productId').isMongoId(), body('qty').isInt({ min: 1 })]), updateCartItem)
router.delete('/remove/:productId', runValidation([param('productId').isMongoId()]), removeCartItem)
router.delete('/clear', clearCart)

export default router

