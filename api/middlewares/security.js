'use strict'

const cors = require('cors')
const helmet = require('helmet')

module.exports = {
  /**
   * CORS
   * @see https://github.com/expressjs/cors#configuring-cors
   */
  cors,
  /**
   * Helmet
   * Set of security settings for expressjs apps.
   * @see https://github.com/helmetjs/helmet#helmet
   */
  helmet
}
