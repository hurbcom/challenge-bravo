const mongoose = require("mongoose");
const { Schema } = mongoose;

const currencySchema = new Schema(
    {
        code: {
            type: String,
            minimum: 3,
            maximum: 3,
            unique: true,
            required: true,
        },
        rateToBase: {
            type: Number,
            required: true,
            minimum: 0,
        },
    },
    { timestamps: true }
);

const Currency = mongoose.model("Currency", currencySchema);
module.exports = Currency;
