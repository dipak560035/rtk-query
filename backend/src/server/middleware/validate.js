import { validationResult } from 'express-validator'

export function runValidation(validations) {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req)
      if (result.errors.length) break
    }
    const errors = validationResult(req)
    if (errors.isEmpty()) return next()
    const err = new Error('Validation failed')
    err.statusCode = 422
    err.errors = errors.array()
    next(err)
  }
}

