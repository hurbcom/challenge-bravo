export default class Currency {
    constructor (CurrencyDB) {
        this.CurrencyDB = CurrencyDB;
    }

    _isFictitiousCurrency (currencyDTO) {
        return currencyDTO.quotation;
    }

    listSupportedCurrencies () {
        return this.CurrencyDB.listAll();
    }

    async storeCurrency(currencyDTO) {
        try {
            const [ existingCurrency ] = await this.CurrencyDB.listBySymbol(currencyDTO.symbol);
            
            if (existingCurrency) throw { already_registered: true };
            
            (this._isFictitiousCurrency(currencyDTO)) ?
                await this.CurrencyDB.storeFictitiousCurrency(currencyDTO) :
                await this.CurrencyDB.storeRealCurrency(currencyDTO);

            return currencyDTO;
        } catch (err) {
            throw err;
        }
    }
}