import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    // expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ success: false, message: 'Email already registered' })
    const user = await User.create({ name, email, password })
    const token = signToken(user)
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' })
    const match = await user.comparePassword(password)
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' })
    const token = signToken(user)
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    next(err)
  }
}

export async function me(req, res, next) {
  try {
    res.json({ success: true, user: req.user })
  } catch (err) {
    next(err)
  }
}

