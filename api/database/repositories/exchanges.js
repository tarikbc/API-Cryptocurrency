'use strict'

const { Error } = require('../../errors')

class ExchangeError extends Error {
    //
}

class ExchangeNotFound extends ExchangeError {
    constructor(exchangeName) {
        super(`exchange ${exchangeName} not found`)
        this.exchangeName = exchangeName
    }
}

class ExchangeCreationError extends ExchangeError {
    constructor(message) {
        super(`error creating exchanges: ${message}`)
    }
}

const ExchangeRepository = function ExchangeRepository (model) {
    /**
     * @return {Promise<Array[Object]>}
     */
    this.all = async () => {
        return model.find()
                    .lean()
    }

    /**
     * @param {String} exchangeName   Exchange name
     * @return {Promise<Object>}  Exchange encontrada
     * @throws {ExchangeNotFound} If no exchange with given name is found
     */
    this.find = async exchangeName => {
        const exchange = model.findOne({ initials: exchangeName })
                              .lean()

        if (!exchange) {
            throw new ExchangeNotFound(exchangeName)
        }

        return exchange
    }

    /**
     * @param {Array[Object]}
     * @returns {Array[String]}
     * @throws {ExchangeCreationError}
     */
    this.bulkCreate = async exchanges => {
        try {
            await model.remove({})
            const createdExchanges = await model.insertMany(exchanges)
            return createdExchanges.map(exchange => exchange._id)
        } catch (err) {
            throw new ExchangeCreationError(err.message)
        }
    }
}

const factory = model => {
    return new ExchangeRepository(model)
}

module.exports = ExchangeRepository
module.exports.ExchangeError = ExchangeError
module.exports.ExchangeNotFound = ExchangeNotFound
module.exports.factory = factory
module.exports.ExchangeCreationError = ExchangeCreationError