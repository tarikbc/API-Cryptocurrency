'use strict'

const mongoose = require('mongoose')
const { book, exchange } = require('./models')
const merge = require('lodash.merge')
const { Books, Exchanges } = require('./repositories')

mongoose.Promise = Promise

/**
 * Initiates MongoDB connection, models and repositories.
 * @param  {Object} config Mongoose connection settings object, containing `uri`
 *                         and `options` properties.
 * @return {Object}        Object containing `connection`, `models` and
 *                         `repositories` properties.
 */
const factory = (config) => {
  const { uri, options } = merge({ options: {} }, config)
  const connection = mongoose.createConnection(uri, options)

  const models = {
    Book: book.factory(connection),
    Exchange: exchange.factory(connection)
  }

  const repositories = {
    books: Books.factory(models.Book),
    exchanges: Exchanges.factory(models.Exchange)
  }

  return { connection, models, repositories }
}

module.exports = { factory }
