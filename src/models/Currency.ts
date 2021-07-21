import mongoose, { Model } from 'mongoose';

export interface ICurrency {
    _id?: string;
    name: string;
    code: string;
    valueInUSD: number;
    created_at?: Date;
    updated_at?: Date;

}

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