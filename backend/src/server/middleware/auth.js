import crypto from 'crypto'
import { User } from '../models/User.js'
import { RefreshToken } from '../models/RefreshToken.js'
import { verifyAccessToken, verifyRefreshToken, signAccessToken } from '../utils/jwt.js'
import { setAuthCookies, clearAuthCookies } from '../utils/cookies.js'

export async function requireAuth(req, res, next) {
  try {
    const accessTokenCookie = req.cookies ? req.cookies.accessToken : null
    const refreshTokenCookie = req.cookies ? req.cookies.refreshToken : null
    const header = req.headers.authorization || ''
    const bearerToken = header.startsWith('Bearer ') ? header.slice(7) : null

    if (!accessTokenCookie && !refreshTokenCookie && !bearerToken) {
      return res.status(401).json({ success: false, message: 'Please login' })
    }

    if (accessTokenCookie) {
      try {
        const payload = verifyAccessToken(accessTokenCookie)
        const user = await User.findById(payload.sub).select('-password')
        if (!user) {
          return res.status(401).json({ success: false, message: 'Unauthorized' })
        }
        req.user = user
        return next()
      } catch (err) {}
    }

    if (bearerToken) {
      try {
        const payload = verifyAccessToken(bearerToken)
        const user = await User.findById(payload.sub || payload.id).select('-password')
        if (!user) {
          return res.status(401).json({ success: false, message: 'Unauthorized' })
        }
        req.user = user
        return next()
      } catch (err) {}
    }

    if (!refreshTokenCookie) {
      return res.status(401).json({ success: false, message: 'Session expired, please login' })
    }

    let refreshPayload
    try {
      refreshPayload = verifyRefreshToken(refreshTokenCookie)
    } catch (err) {
      clearAuthCookies(res)
      return res.status(401).json({ success: false, message: 'Session expired, please login' })
    }

    const userId = refreshPayload.sub
    const hashedRefresh = crypto.createHash('sha256').update(refreshTokenCookie).digest('hex')

    const stored = await RefreshToken.findOne({
      user: userId,
      tokenHash: hashedRefresh,
      revokedAt: { $exists: false },
      expiresAt: { $gt: new Date() }
    })

    if (!stored) {
      clearAuthCookies(res)
      return res.status(401).json({ success: false, message: 'Session expired, please login' })
    }

    const user = await User.findById(userId).select('-password')
    if (!user) {
      clearAuthCookies(res)
      return res.status(401).json({ success: false, message: 'Session expired, please login' })
    }

    const newAccessToken = signAccessToken(user)
    setAuthCookies(res, newAccessToken, refreshTokenCookie)

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


