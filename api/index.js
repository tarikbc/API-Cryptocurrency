'use strict'

const express = require('express')
const database = require('./database')
const controllers = require('./controllers')
const middlewares = require('./middlewares')

/**
 * Application factory
 * @param  {Ojbect} config      Configuration object.
 * @param  {String} environment Environment name.
 * @return {Object}             Express instance.
 */
const factory = (config, environment) => {
  const app = express()

  /**
   * Pre-controller middlewares
   */
  app.use(middlewares.loggers.requests(config.loggers.requests, environment))
  app.use(middlewares.security.cors(config.cors))
  app.use(middlewares.sentry.requestHandler())
  app.use(middlewares.parsers.urlencoded())
  app.use(middlewares.security.helmet())
  app.use(middlewares.parsers.json())

  /**
   * Domain instances
   */
  const { repositories } = database.factory(config.mongodb)

  /**
   * Controllers
   */
  app.get('/ping', controllers.utils.healthcheck(config, environment))

  app.get('/books', controllers.books.list(repositories.books))
  app.post('/books', controllers.books.create(repositories.books))
  app.get('/books/:exchange', controllers.books.find(repositories.books))

  app.get('/exchanges', controllers.exchanges.list(repositories.exchanges))
  app.post('/exchanges', controllers.exchanges.create(repositories.exchanges))
  app.get('/exchanges/:name', controllers.exchanges.find(repositories.exchanges))

  /**
   * Error handlers / Post-controller middlewares
   */
  app.use('*', middlewares.errorHandlers.unmatched())
  app.use(middlewares.errorHandlers.validation())
  app.use(middlewares.errorHandlers.domain())
  app.use(middlewares.sentry.errorHandler())
  app.use(middlewares.errorHandlers.normalizer())
  app.use(middlewares.errorHandlers.renderer())

  return app
}

module.exports = { factory }
