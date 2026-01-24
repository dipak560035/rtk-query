import { Router } from 'express'
import { body, param } from 'express-validator'
import { runValidation } from '../middleware/validate.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { upload } from '../config/multer.js'
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller.js'

const router = Router()

router.get('/', getProducts)
router.get('/:id', runValidation([param('id').isMongoId()]), getProductById)

router.post(
  '/',
  requireAuth,
  requireAdmin,
  upload.array('images', 6),
  runValidation([body('name').notEmpty(), body('price').isFloat({ gt: 0 })]),
  createProduct
)

router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  upload.array('images', 6),
  runValidation([param('id').isMongoId()]),
  updateProduct
)

router.delete('/:id', requireAuth, requireAdmin, runValidation([param('id').isMongoId()]), deleteProduct)

export default router

