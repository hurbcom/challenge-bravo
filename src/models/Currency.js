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
        type: Number,
        required: true
    },
    low: {
        type: Number,
        required: true
    },
    varBid: {
        type: Number,
        required: true
    },
    pctChange: {
        type: Number,
        required: true
    },
    bid: {
        type: Number,
        required: true
    },
    ask: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    create_date: {
        type: Date,
        required: true
    }
},{
    timestamps: true
})

module.exports = model('Currency', CurrencySchema)