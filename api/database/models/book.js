'use strict'

const { Schema } = require('mongoose')

const properties = {
  exchange: {
    type: String,
    required: true
  },
  bids:[{
    price:{
      type: Number,
      required: true
    }, 
    volume: {
      type: Number,
      required: true
    }
  }],
  asks: [{
    price: {
      type: Number,
      required: true
    },
    volume: {
      type: Number,
      required: true
    }
  }]

}

const options = {
  collection: 'books',
  id: false,
  strict: true,
  safe: true,
  timestamps: true,
  versionKey: false
}

const schema = new Schema(properties, options)

const factory = (connection) => {
  return connection.model('Book', schema)
}

module.exports = { factory, schema }
