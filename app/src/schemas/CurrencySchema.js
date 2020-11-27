import mongoose, { Schema } from 'mongoose';

const CurrencySchema = new Schema(
    {
        currency: { type: String, unique: true, required: true }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Currency', CurrencySchema, 'currencies');
