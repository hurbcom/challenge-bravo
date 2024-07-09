import mongoose, { Schema } from "mongoose";

const ExchangeRateSchema: Schema = new Schema(
    {
        from: { type: String, required: true, index: true },
        to: { type: String, required: true, index: true },
        rate: { type: Number, required: true },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {}
);

export default mongoose.model("ExchangeRate", ExchangeRateSchema);
