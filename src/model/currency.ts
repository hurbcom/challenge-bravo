import mongoose from 'mongoose';

export type CurrencyDto = {
  code: string;
  rate: string;
};

const { Schema } = mongoose;

const currencySchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export const Currency = mongoose.model('Currency', currencySchema);
