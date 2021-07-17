import mongoose, { Document, Model } from 'mongoose';

export interface Moeda {
    _id?: string;
    name: string;
    sigla: string;
    valorEmReal: number;

  }

  const schema = new mongoose.Schema(
    {
        valorEmReal: { type: Number, required: true },
      name: { type: String, required: true },
      sigla: { type: String, required: true }

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

  interface MoedaModel extends Omit<Moeda, '_id'>, Document {}
  export const Moeda: Model<MoedaModel> = mongoose.model('Moeda', schema);