import { Schema, model } from "mongoose";
import CurrencyInterface from "./CurrencyInterface";

export default model<CurrencyInterface>(
	"Currency",
	new Schema(
		{
			symbol: {
				type: String,
				required: true,
			},
			conversionFactor: {
				type: Number,
				required: true,
			},
		},
		{
			timestamps: true,
		}
	)
);
