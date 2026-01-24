export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: 'Resource not found'
  })
}

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    errors: err.errors || undefined
  })
}

