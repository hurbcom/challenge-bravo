export default class Currency {
    constructor (CurrencyDB) {
        this.CurrencyDB = CurrencyDB;
    }

    _isFictitiousCurrency (currencyDTO) {
        return currencyDTO.currencyQuote;
    }

    listSupportedCurrencies () {
        return this.CurrencyDB.listCurrencies();
    }

    async storeCurrency (currencyDTO) {
        try {
            const [ existingCurrency ] = await this.CurrencyDB.listCurrencyByCode(currencyDTO.currencyCode);
            
            if (existingCurrency) throw { already_registered: true };
            
            (this._isFictitiousCurrency(currencyDTO)) ?
                await this.CurrencyDB.storeFictitiousCurrency(currencyDTO) :
                await this.CurrencyDB.storeRealCurrency(currencyDTO);

            return currencyDTO;
        } catch (err) {
            throw err;
        }
    }

    async deleteCurrency (currencyDTO) {
        try {
            const [ existingCurrency ] = await this.CurrencyDB.listCurrencyByCode(currencyDTO.currencyCode);
            
            if (!existingCurrency) throw { not_found: true };
            
            await this.CurrencyDB.deleteCurrency(existingCurrency.id);

            return currencyDTO;
        } catch (err) {
            throw err;
        }
    }
}