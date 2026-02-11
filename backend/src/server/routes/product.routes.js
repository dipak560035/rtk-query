import { Router } from 'express'
import { body, param } from 'express-validator'
import { runValidation } from '../middleware/validate.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { upload } from '../config/multer.js'
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, addProductReview } from '../controllers/product.controller.js'

const router = Router()

router.get('/', getProducts)
router.get('/:id', runValidation([param('id').isMongoId()]), getProductById)

router.post(
  '/',
  requireAuth,
  requireAdmin,
  upload.array('images', 5),
  runValidation([body('name').notEmpty(), body('price').isFloat({ gt: 0 })]),
  createProduct
)


router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  upload.array('images', 5),
  runValidation([param('id').isMongoId()]),
  updateProduct
)

// Alias POST to PUT for user convenience
router.post(
  '/:id',
  requireAuth,
  requireAdmin,
  upload.array('images', 5),
  runValidation([param('id').isMongoId()]),
  updateProduct
)


router.delete('/:id', requireAuth, requireAdmin, runValidation([param('id').isMongoId()]), deleteProduct)


router.post(
  '/:id/reviews',
  requireAuth,
  runValidation([param('id').isMongoId(), body('rating').isInt({ min: 1, max: 5 }), body('comment').notEmpty()]),
  addProductReview
)

export default router
