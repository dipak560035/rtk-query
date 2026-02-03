import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import fs from 'fs'
import path from 'path'

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

export async function updateProfile(req, res, next) {
  try {
    const updates = { ...req.body }
    const user = req.user

    if (req.file) {
      if (user.avatar) {
        const filename = user.avatar.replace('/uploads/', '')
        const filePath = path.join(process.cwd(), 'uploads', filename)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }
      updates.avatar = `/uploads/${req.file.filename}`
    }

    // Prevent password update via this route if not intended, or handle it securely
    // For now, let's remove password from updates if it's empty or not meant to be updated here
    // But typically profile update might include password change.
    // Given the prompt "add profile photo and change the profile photo", I'll focus on that.
    // If password is in body, user schema pre-save hook handles hashing if modified.
    // But if we use findByIdAndUpdate, pre-save hook MIGHT NOT run depending on options.
    // Mongoose documentation: pre('save') only runs on save(). findByIdAndUpdate does NOT trigger save hooks.
    // So if password update is needed, we should use save().
    // However, for now, let's stick to profile fields (name, avatar, etc.)
    // If password is sent, we should probably ignore it here unless we implement specific logic.
    // Let's assume this is for profile info (name, avatar).
    delete updates.password
    delete updates.email // Usually email change requires verification, let's allow name/avatar.

    const updatedUser = await User.findByIdAndUpdate(user._id, updates, { new: true }).select('-password')
    res.json({ success: true, user: updatedUser })
  } catch (err) {
    next(err)
  }
}

