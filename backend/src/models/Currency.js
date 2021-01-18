const { Schema, model } = require("mongoose");

const CurrencySchema = new Schema({
    symbol: {
        type: String,
        required: true,
        index: true,
    },
    label: {
        type: String,
        required: false,
    },
}, {
    collection: "currencies",
});

module.exports = model("Currency", CurrencySchema);