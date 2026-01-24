import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.id).select('-password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }
    req.user = user
    next()
  } catch (err) {
    err.statusCode = 401
    next(err)
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' })
  }
  next()
}

