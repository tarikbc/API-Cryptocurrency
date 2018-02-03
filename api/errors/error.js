'use strict'

module.exports = class extends Error {
  constructor (message, stack) {
    super(message)
    this.stack = stack
    this.name = this.constructor.name
  }
}
