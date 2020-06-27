import { Currency } from "../models/currency.model";
import { HashTable } from "../infrastructure/crosscutting/hashtable";

export class CurrencyRepository {
    private _currencies: HashTable<Currency>;

    /**
     *
     */
    constructor() {
        this._currencies = {};
        this.seedData();
    }

    private seedData(): void {
        this.insertOrUpdateCurrency(new Currency('USD', 1));
    }

    public insertOrUpdateCurrency(newCurrency: Currency): Currency {
        this._currencies[newCurrency.id] = newCurrency;
        return this._currencies[newCurrency.id];
    }

    public getCurrencyById(id: string): Currency | null {
        return this._currencies[id.toUpperCase()] || null;
    }
}
