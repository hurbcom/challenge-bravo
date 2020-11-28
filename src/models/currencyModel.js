const mongoose = require("mongoose");
const { Schema } = mongoose;

// Configura o schema
const currencySchema = new Schema({
    sigla: String,
    nome: String
});

var Currency = module.exports = mongoose.model("Currency", currencySchema);

module.exports.get = function (callback, limit) {
    Currency.find(callback).limit(limit);
}