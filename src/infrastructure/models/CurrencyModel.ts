import mongoose, { Schema } from "mongoose";

const CurrencySchema: Schema = new Schema({
    code: { type: String, required: true, unique: true, index: true },
});

export default mongoose.model("Currency", CurrencySchema);
