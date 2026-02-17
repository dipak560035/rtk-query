import { Router } from 'express'
import { body } from 'express-validator'
import { runValidation } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'
import { upload } from '../config/multer.js'
import { register, login, me, updateProfile,forgotPassword,
  resetPassword } from '../controllers/auth.controller.js'

const router = Router()

router.post(
  '/register',
  runValidation([body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })]),
  register
)

router.post('/login', runValidation([body('email').isEmail(), body('password').notEmpty()]), login)

router.get('/me', requireAuth, me)

router.put('/profile', requireAuth, upload.single('avatar'), updateProfile)

//forget password
router.post(
  '/forgot-password',
  runValidation([
    body('email').isEmail().withMessage('Valid email required')
  ]),
  forgotPassword
)

//reset password

router.post(
  '/reset-password/:token',
  runValidation([
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ]),
  resetPassword
)


export default router

