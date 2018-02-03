'use strict'

const axios = require('axios')
const rescue = require('express-rescue')
const { HttpError } = require('../errors')
const { NoBooksFound, BookCreationError } = require('../database/repositories/books')

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
    if (err instanceof NoBooksFound) {
        return next(new HttpError(404, 'not_found', err.message))
    }

    if (err instanceof BookCreationError) {
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
            const books = await repository.all()

            res.status(200)
                .set({ 'X-Results-Count': books.length })
                .json(books)             
        }),
        domainErrorHandler
    ]
}

/**
 * @param {Object} repository Books repository instance
 * @return {Function}
 */
const create = repository => {
  return [
    rescue(async (req, res) => {
        const { data: book } = await axios.get('https://api.bitvalor.com/v1/order_book.json')
        const bidExchanges = book.bids.map(([exchange]) => exchange)
        const askExchanges = book.asks.map(([exchange]) => exchange)
        const exchangeSet = new Set(bidExchanges.concat(askExchanges))

        const exchanges = Array.from(exchangeSet.values())

        const getForExchange = exchange =>([bidExchange]) => bidExchange === exchange
        const makeItem = ([exchange, price, volume]) => ({ price, volume })

        const booksToInsert = exchanges.map(exchange => {
            const bids = book.bids.filter(getForExchange(exchange))
                .map(makeItem)
            const asks = book.asks.filter(getForExchange(exchange))
                .map(makeItem)

            return {
                exchange,
                bids,
                asks
            }
        })

        const ids = await repository.bulkCreate(booksToInsert)

        res.status(201)
           .json(ids)
    }),
    domainErrorHandler
  ]
}

/**
 * @param {Object} repository Books repository instance
 * @return {Array[Function]}
 */
const find = repository => {
    return [
        rescue(async (req, res) => {
            const book = await repository.find(req.params.exchange)

            res.status(200)
               .json(book)
        }),
        domainErrorHandler
    ]
}

module.exports = { list, create, find }