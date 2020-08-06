import { Document } from "mongoose";

export default interface CurrencyInterface extends Document {
    symbol: string,
    conversionFactor: number
}