'use strict'

const Error = require('./error')

module.exports = class HttpError extends Error {
  constructor (status, code, message, stack) {
    super(message, stack)
    this.code = code
    this.status = status
  }
}
