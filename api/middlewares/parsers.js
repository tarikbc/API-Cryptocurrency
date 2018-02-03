'use strict'

const { json, urlencoded } = require('body-parser')

module.exports = {
  /**
   * JSON body parser
   * Automatically parses json requests and places it into Request#body.
   * @see https://github.com/expressjs/body-parser#bodyparserjsonoptions
   * @type {Function}
   */
  json,
  /**
   * URL encode parser
   * Automatically parses data from query string and places it into Request#body.
   * @see https://github.com/expressjs/body-parser#bodyparserurlencodedoptions
   * @type {Function}
   */
  urlencoded: () => urlencoded({ extended: false })
}
