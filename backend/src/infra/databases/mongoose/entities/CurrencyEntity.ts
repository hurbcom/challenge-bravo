import mongoose, { Schema, Document } from 'mongoose';

import { ICurrency } from '@interfaces/ICurrency';

export interface ICurrencyMongoose extends Document, ICurrency {}

const CurrencySchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    backingCurrency: {
      code: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model<ICurrencyMongoose>('Currency', CurrencySchema);
