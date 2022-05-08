import mongoose from 'mongoose';
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

const Currency = mongoose.model('Currency', currencySchema);

export default Currency;
