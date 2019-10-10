const mongoose = require("mongoose");

var CurrencySchema = mongoose.Schema({
    name: { type: String, required: true }
});

exports.Currency = mongoose.model("Currency", CurrencySchema);