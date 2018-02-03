'use strict'

/**
 * Healthcheck route
 * The endpoint to which healthcheck tools should point.
 * @return {Function}
 */
const healthcheck = (config, environment) => {
  return (req, res) => {
    res.set({
      'X-Service': process.env.npm_package_name,
      'X-Uptime': Math.floor(process.uptime())
    })

    if (environment !== 'production') {
      res.set({
        'X-Environment': environment,
        'X-Config': JSON.stringify(config)
      })
    }

    res.send('Pong!')
  }
}

module.exports = { healthcheck }
