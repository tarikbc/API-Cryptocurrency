'use strict'

const { Schema } = require('mongoose')

const properties = {
    initials: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    url_book: {
        type: String,
        required: true
    },
    fees: {
        in_BRL: {
            percent: {
                type: Number,
                required: true
            },
            value: {
                type: Number,
                required: true
            }
        },
        in_BTC: {
            percent: {
                type: Number,
                required: true
            },
            value: {
                type: Number,
                required: true
            }
        },
        out_BRL: {
            percent: {
                type: Number,
                required: true
            },
            value: {
                type: Number,
                required: true
            }
        },
        out_BTC: {
            percent: {
                type: Number,
                required: true
            },
            value: {
                type: Number,
                required: true
            }
        },
        trade_book: {
            percent: {
                type: Number,
                required: true
            },
            value: {
                type: Number,
                required: true
            }
        },
        trade_market: {
            percent: {
                type: Number,
                required: true
            },
            value: {
                type: Number,
                required: true
            }
        }
    }
}

const options = {
    collection: 'exchanges',
    id: false,
    strict: true,
    safe: true,
    timestamps: true,
    versionKey: false
}

const schema = new Schema(properties, options)

const factory = (connection) => {
    return connection.model('Exchange', schema)
}

module.exports = { factory, schema }