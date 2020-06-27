import { Currency } from "./currency.model";

export class ConvertedCurrency {
    public ammount: number;
    public date: Date;
    public from: Currency;
    public to: Currency;

    constructor(ammount: number, from: Currency, to: Currency) {
        this.ammount = ammount;
        this.date = new Date();
        this.from = from;
        this.to = to;
    }
}