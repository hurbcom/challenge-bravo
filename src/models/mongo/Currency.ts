import mongoose, { Model } from 'mongoose';
import { ICurrency } from '../ICurrency';



const schema = new mongoose.Schema(
    {

        name: { type: String, required: true },
        code: { type: String, required: true, unique: true },
        valueInUSD: { type: Number, required: true },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },

    },

    {
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);


export const Currency: Model<ICurrency> = mongoose.model('Currency', schema);