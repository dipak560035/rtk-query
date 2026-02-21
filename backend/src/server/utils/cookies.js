const isProd = process.env.NODE_ENV === 'production'

function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge
  }
}

export function setAuthCookies(res, accessToken, refreshToken) {
  const accessMaxAge = 5 * 60 * 1000
  const refreshMaxAge = 7 * 24 * 60 * 60 * 1000

  res.cookie('accessToken', accessToken, cookieOptions(accessMaxAge))
  res.cookie('refreshToken', refreshToken, cookieOptions(refreshMaxAge))
}

export function clearAuthCookies(res) {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax'
  })
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax'
  })
}

