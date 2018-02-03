'use strict'

const { Error } = require('../../errors')

class BookError extends Error {
 //
}

class NoBooksFound extends BookError {
  constructor (exchangeName) {
    super(`no books fuond for exchange ${exchangeName}`)
    this.exchangeName = exchangeName
  }
}

class BookCreationError extends BookError {
  constructor (message) {
    super(`error creating books: ${message}`)
  }
}

const BookRepository = function BookRepository (model) {
  /**
   * @return {Promise<Array[Object]>}
   */
  this.all = async () => {
    return model.find()
                .lean()
  }

  /**
   * @param {String} exchange         Exchange name
   * @return {Promise<Object>}        Exchange books
   * @throws {NoBooksFound}           If no books are found for given exchange
   */
  this.find = async exchange => {
    const book = await model.findOne({ exchange })
                             .lean()

    if (!book) {
      throw new NoBooksFound(exchange)
    }

    return book
  }

  /**
   * @param {Array[Object]} books Books to create
   * @returns {Array[String]}     Created books ObjectIds
   * @throws {BookCreationError}  If any group fails to be created
   */
  this.bulkCreate = async books => {
    try {
      await model.remove({})
      const createdBooks = await model.insertMany(books)
      return createdBooks.map(book => book._id)
    } catch (err) {
      throw new BookCreationError(err.message)
    }
  }
}

const factory = model => {
  return new BookRepository(model)
}

module.exports = BookRepository
module.exports.BookError = BookError
module.exports.NoBooksFound = NoBooksFound
module.exports.factory = factory
module.exports.BookCreationError = BookCreationError