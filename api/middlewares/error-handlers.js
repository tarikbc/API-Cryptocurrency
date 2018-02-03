'use strict'

const { HttpError } = require('../errors')
const { ValidationError } = require('express-json-validator')

/**
 * Unmatched Error Handler
 * Handles 'page not found' requests.
 * @return {Function}
 */
const unmatched = () => {
  return (req, res, next) => {
    return next(new HttpError(404, 'not_found', 'resource not found'))
  }
}

/**
 * Failed validation handler.
 * @return {Function}
 */
const validation = () => {
  return (err, req, res, next) => {
    if ((err instanceof ValidationError) === false) {
      return next(err)
    }

    return next(new HttpError(422, 'invalid_parameter', err.message))
  }
}

/**
 * Domain Error Handler
 * Handles domain errors and MUST pass an HttpError to the next middleware.
 * @return {Function}
 */
const domain = () => {
  return (err, req, res, next) => {
    if (err instanceof HttpError) {
      return next(err)
    }

    // Place domain error handlers here:
    // if (err instanceof TaskNotFound) {
    //   return next(new HttpError(404, 'not_found', err.message))
    // }

    return next(err)
  }
}

/**
 * Normalizer Error Handler
 * Normalizes non-HttpError errors into HttpError.
 * @return {Function}
 */
const normalizer = () => {
  return (err, req, res, next) => {
    if (err instanceof HttpError) {
      return next(err)
    }

    return next(new HttpError(500, 'internal_error', err.message, err.stack))
  }
}

/**
 * Renderer Error Handler
 * Renders HttpError as JSON response.
 * @return {Function}
 */
const renderer = (environment) => {
  return (err, req, res, next) => {
    const { code = 'internal_error', message, status = 500 } = err
    const stack = (environment !== 'production')
      ? err.stack
      : undefined

    res.status(status)
       .json({ status, error: { code, message, stack } })
  }
}

module.exports = {
  unmatched,
  validation,
  domain,
  normalizer,
  renderer
}
