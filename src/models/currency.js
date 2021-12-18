const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CurrencySchema = new Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    bid: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

const Currency = mongoose.model('Currency', CurrencySchema, 'currencies');

module.exports = {
    getAll: async () => {
        return await Currency.find();
    },
    getByCode: async code => {
        return await Currency.findOne({ code });
    },
}