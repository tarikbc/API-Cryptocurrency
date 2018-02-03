'use strict'

const Raven = require('raven')
const { HttpError } = require('../errors')

/**
 * Request Handler
 * Binds Request and Response objects to Sentry's context.
 * @return {Function}
 */
const requestHandler = () => {
  return (req, res, next) => {
    if (!Raven.installed) {
      return next()
    }

    return Raven.requestHandler()(req, res, next)
  }
}

/**
 * Error Handler
 * Logs unpredicted errors to sentry.
 * @return {Function}
 */
const errorHandler = () => {
  return (err, req, res, next) => {
    if (err instanceof HttpError) {
      return next(err)
    }

    if (!Raven.installed) {
      return next(err)
    }

    return Raven.errorHandler()(err, req, res, next)
  }
}

module.exports = {
  requestHandler,
  errorHandler
}
