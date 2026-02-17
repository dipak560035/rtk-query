import jwt from 'jsonwebtoken'

function accessExpiry() {
  return process.env.ACCESS_TOKEN_EXPIRES_IN || '5m'
}

function refreshExpiry() {
  return process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
}

export function signAccessToken(user) {
  const payload = {
    sub: user._id.toString(),
    email: user.email,
    role: user.role
  }

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET, {
    expiresIn: accessExpiry()
  })
}

export function signRefreshToken(user) {
  const payload = {
    sub: user._id.toString()
  }

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET, {
    expiresIn: refreshExpiry()
  })
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET)
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET)
}

