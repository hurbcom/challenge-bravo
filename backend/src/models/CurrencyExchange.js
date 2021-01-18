const { Schema, model } = require("mongoose");

const CurrencyExchangeSchema = new Schema({
    baseSymbol: {
        type: String,
        required: true,
        index: true,
    },
    rates: [{
        symbol: {
            type: String,
            required: true,
        },
        rate: {
            type: Number,
            required: true,
        },
    }],
    createdAt: {
        type: Date,
        required: true,
    },
},{
  collection: "currency_exchanges",
});

module.exports = model("CurrencyExchange", CurrencyExchangeSchema);