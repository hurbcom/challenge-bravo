const mongoose = require("mongoose");

var CurrencySchema = mongoose.Schema({
    name: { type: String, required: true },
    status: { type: Boolean, required: true }
});

exports.Currency = mongoose.model("Currency", CurrencySchema);