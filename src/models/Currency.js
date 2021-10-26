'use strict'

const { Schema, model } = require('mongoose');

const CurrencySchema = new Schema({
    code: {
        type: String,
        uppercase: true,
        required: true
    },
    codein: {
        type: String,
        uppercase: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    high: {
        type: String,
        required: true
    },
    low: {
        type: String,
        required: true
    },
    varBid: {
        type: String,
        required: true
    },
    pctChange: {
        type: String,
        required: true
    },
    bid: {
        type: String,
        required: true
    },
    ask: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

module.exports = model('Currency', CurrencySchema)