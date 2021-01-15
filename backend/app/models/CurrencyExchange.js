const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

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
  collection: "currency_exchange",
});

module.exports = model("CurrencyExchangeSchema", CurrencyExchangeSchema);