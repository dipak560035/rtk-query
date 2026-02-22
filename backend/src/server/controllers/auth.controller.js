
import { User } from '../models/User.js'
import { RefreshToken } from '../models/RefreshToken.js'
import { signAccessToken, signRefreshToken } from '../utils/jwt.js'
import { setAuthCookies, clearAuthCookies } from '../utils/cookies.js'


import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../config/email.js'

// REFRESH TOKEN CREATION

async function createAndStoreRefreshToken(user) {
  const refreshToken = signRefreshToken(user)

  const payload = JSON.parse(
    Buffer.from(refreshToken.split('.')[1], 'base64').toString('utf8')
  )

  const expiresAt = new Date(payload.exp * 1000)

  const hashedRefresh = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex')

  await RefreshToken.deleteMany({ user: user._id })

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashedRefresh,
    expiresAt
  })

  return refreshToken
}

// REGISTER

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body

    const exists = await User.findOne({ email })
    if (exists)
      return res
        .status(409)
        .json({ success: false, message: 'Email already registered' })

    const user = await User.create({ name, email, password })

    const accessToken = signAccessToken(user)
    const refreshToken = await createAndStoreRefreshToken(user)

    setAuthCookies(res, accessToken, refreshToken)

    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    next(err)
  }
}

// LOGIN

export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const match = await user.comparePassword(password)
    if (!match)
      return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const accessToken = signAccessToken(user)
    const refreshToken = await createAndStoreRefreshToken(user)

    setAuthCookies(res, accessToken, refreshToken)

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    next(err)
  }
}

// LOGOUT

export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies?.refreshToken

    if (refreshToken) {
      const hashedRefresh = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex')

      await RefreshToken.updateMany(
        { tokenHash: hashedRefresh },
        { $set: { revokedAt: new Date() } }
      )
    }

    clearAuthCookies(res)

    res.json({ success: true, message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
}

// ME

export async function me(req, res, next) {
  try {
    res.json({ success: true, user: req.user })
  } catch (err) {
    next(err)
  }
}

// UPDATE PROFILE 

export async function updateProfile(req, res, next) {
  try {
    const updates = { ...req.body }
    const user = req.user

    if (req.file) {
      if (user.avatar) {
        const filename = user.avatar.replace('/uploads/', '')
        const filePath = path.join(process.cwd(), 'uploads', filename)

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      }

      updates.avatar = `/uploads/${req.file.filename}`
    }

    delete updates.password
    delete updates.email

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updates,
      { new: true }
    ).select('-password')

    res.json({ success: true, user: updatedUser })
  } catch (err) {
    next(err)
  }
}


   // FORGOT PASSWORD


export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user)
      return res.json({
        success: true,
        message: 'If this email exists, a reset link has been sent'
      })

    const resetToken = crypto.randomBytes(32).toString('hex')

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000 // 1 hour

    await user.save()

    // const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5180'}/reset-password/${resetToken}`
    const CLIENT_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL // should point to Vercel frontend
    : 'http://localhost:5180'

const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`

    await sendEmail({
      to: user.email,
      subject: 'Reset your HavenCraft password',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset.</p>
        <p>Click below:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 1 hour.</p>
      `
    })

    res.json({ success: true, message: 'Password reset email sent' })
  } catch (err) {
    next(err)
  }
}


   // RESET PASSWORD


export async function resetPassword(req, res, next) {
  try {
    const { token } = req.params
    const { password } = req.body

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user)
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      })

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    res.json({
      success: true,
      message: 'Password reset successful'
    })
  } catch (err) {
    next(err)
  }
}










