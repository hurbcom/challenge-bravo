const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CurrencySchema = new Schema({
    code: {
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
        return await Currency.find({}, {
            _id: 0,
            code: 1,
            bid: 1,
            updatedAt: 1
        });
    },
    getByCode: async code => {
        return await Currency.findOne({ code }, {
            _id: 0,
            code: 1,
            bid: 1,
            updatedAt: 1
        });
    },
    newCurrency: async (code, bid) => {
        return await Currency.updateOne(
            {code},
            {code,bid},
            {upsert:true}
        );
    }
}