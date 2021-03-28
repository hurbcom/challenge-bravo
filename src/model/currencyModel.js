const mongoose = require("mongoose");

const CurrencySchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Currency", CurrencySchema);
