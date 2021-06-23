export default class Currency {
    constructor (CurrencyDB) {
        this.CurrencyDB = CurrencyDB;
    }

    listSupportedCurrencies () {
        return this.CurrencyDB.listAll();
    }
}