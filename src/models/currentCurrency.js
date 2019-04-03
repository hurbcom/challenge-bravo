import mongoose from 'mongoose';

const currentCurrencySchema = new mongoose.Schema({
    currency: {
        type: String,
        unique: true,
    },
    createdAt: {
        type: Date
    },
    exchange: {
        type: Number
    }
}, { strict: false });

currentCurrencySchema.index( { currency: "text" } );

currentCurrencySchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });
const CurrrentCurrency = mongoose.model('CurrrentCurrency', currentCurrencySchema);

export default CurrrentCurrency;