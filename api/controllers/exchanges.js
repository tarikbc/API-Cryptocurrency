'use strict'

const axios = require('axios')
const rescue = require('express-rescue')
const { HttpError } = require('../errors')
const { ExchangeNotFound, ExchangeCreationError } = require('../database/repositories/exchanges')

/**
 * Domain Error Handler
 * Handles domain errors then passes a HttpError to the next middleware.
 * @param  {Object}   err  Error object.
 * @param  {Object}   req  Express' Request object.
 * @param  {Object}   res  Express' Response object.
 * @param  {Function} next Next middleware caller.
 * @return {Function}
 */
const domainErrorHandler = (err, req, res, next) => {
    if (err instanceof ExchangeNotFound) {
        return next(new HttpError(404, 'not_found', err.message))
    }

    if (err instanceof ExchangeCreationError) {
        return next(new HttpError(400, 'cant_create', err.message))
    }

    return next(err)
}

/**
 * @param {Object} repository Books repository instance.
 * @return {Function}
 */
const list = repository => {
    return [
        rescue(async (req, res) => {
            const exchanges = await repository.all()

            res.status(200)
                .set({ 'X-Results-Count': exchanges.length })
                .json(exchanges)
        }),
        domainErrorHandler
    ]
}

/**
 * @param {Object} repository Exchanges repository instance
 * @return {Function}
 */
const create = repository => {
    return [
        rescue(async (req, res) => {
            const { data: exchanges } = await axios.get('https://api.bitvalor.com/v1/exchanges.json')

            const exchangeIds = Object.keys(exchanges)

            const makeFee = ([percent, value]) => ({ percent, value })

            const exchangesToInsert = exchangeIds.map(exchangeId => {
                const exchange = exchanges[exchangeId]
                const { name, url, url_book } = exchange
                const { in_BRL, in_BTC, out_BRL, out_BTC, trade_book, trade_market } = exchange.fees

                return {
                    initials: exchangeId,
                    name,
                    url,
                    url_book,
                    fees: {
                        in_BRL: makeFee(in_BRL),
                        in_BTC: makeFee(in_BTC),
                        out_BRL: makeFee(out_BRL),
                        out_BTC: makeFee(out_BTC),
                        trade_book: makeFee(trade_book),
                        trade_market: makeFee(trade_market)
                    }
                }
            })

            const ids = await repository.bulkCreate(exchangesToInsert)

            res.status(201)
               .json(ids)
        }),
        domainErrorHandler
    ]
}

/**
 * @param {Object} repository Exchanges repository instance
 * @return {Array[Function]}
 */
const find = repository => {
    return [
        rescue(async (req, res) => {
            const exchange = await repository.find(req.params.name)

            res.status(200)
                .json(exchange)
        }),
        domainErrorHandler
    ]
}

module.exports = { list, create, find }