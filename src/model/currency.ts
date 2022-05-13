import mongoose from 'mongoose';

export enum CurrencyType {
  REAL = 'REAL',
  FICTITIOUS = 'FICTITIOUS',
}

export type CurrencyDto = {
  code: string;
  exchangeRate: string;
  type?: CurrencyType;
};

const { Schema } = mongoose;

const currencySchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    exchangeRate: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Currency = mongoose.model('Currency', currencySchema);
