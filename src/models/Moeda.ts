import mongoose, {  Model } from 'mongoose';

export interface IMoeda {
    _id?: string;
    name: string;
    sigla: string;
    valueInReal: number;

}

const schema = new mongoose.Schema(
    {

        name: { type: String, required: true },
        sigla: { type: String, required: true, unique: true },
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


export const Moeda: Model<IMoeda> = mongoose.model('Moeda', schema);