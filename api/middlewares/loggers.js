'use strict'

const morgan = require('morgan')
const merge = require('lodash.merge')

/**
 * Requests logger.
 * @param  {Object} config Mongan settings object.
 * @param  {String} env    Production, staging or developement.
 * @see https://github.com/expressjs/morgan#morgan
 * @return {Function}
 */
const requests = (config, env) => {
  /**
   * Merging default setting into 'config' variable.
   * @type {Object}
   */
  config = merge(
    { format: ':method :url :status :res[content-length] - :response-time ms' },
    config
  )

  return morgan(config.format, {
    skip: (req, res) => {
      // Skipping successful status on production.
      return env === 'production' && res.statusCode >= 400
    }
  })
}

module.exports = { requests }
