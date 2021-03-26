  
const { Schema, model } = require("mongoose");
const ModelName = 'CoinExchange';

const CoinExchangeSchema = new Schema({
    baseSymbol: {
        type: String,
        required: true,
        index: true,
    },
    rates: [{
        to: {
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
        //required: true,
        timestamps: true
    },
},{
  collection: "coinexchanges",
});

module.exports = model(ModelName, CoinExchangeSchema);