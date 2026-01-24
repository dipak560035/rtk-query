import { Router } from 'express'
import { body } from 'express-validator'
import { runValidation } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'
import { register, login, me } from '../controllers/auth.controller.js'

const router = Router()

router.post(
  '/register',
  runValidation([body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })]),
  register
)

router.post('/login', runValidation([body('email').isEmail(), body('password').notEmpty()]), login)

router.get('/me', requireAuth, me)

export default router

