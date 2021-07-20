import mongoose, { Model } from 'mongoose';

export interface ICurrency {
    _id?: string;
    name: string;
    code: string;
    valueInReal: number;

}

const schema = new mongoose.Schema(
    {

        name: { type: String, required: true },
        code: { type: String, required: true, unique: true },
        valueInReal: { type: Number, required: true },

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