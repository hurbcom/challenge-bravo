const mongoose = require('mongoose');
const { Schema } = mongoose;

// Configura o schema
const currencySchema = new Schema({
    sigla: {
        type: String,
        unique: true,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
});

var Currency = module.exports = mongoose.model('Currency', currencySchema);

module.exports.get = function (callback, limit) {
    Currency.find(callback).limit(limit);
}