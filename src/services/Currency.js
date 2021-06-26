import Utils from "../libs/Utils";

export default class Currency {
    constructor (CurrencyDB) {
        this.CurrencyDB = CurrencyDB;
    }

    _isFictitiousCurrency (currencyDTO) {
        return currencyDTO.currencyQuote;
    }

    _convertAmount (currencyQuoteFrom, currencyQuoteTo, amount) {
        return amount;
    }

    async listSupportedCurrencies () {
        try {
            const currenciesList = await this.CurrencyDB.listCurrencies();

            return currenciesList.map(currency => currency.code);
        } catch (err) {
            throw err;
        }
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

    async convertsAmountBetweenCurrencies(currencyCodeFrom, currencyCodeTo, amount) {
        try {
            const currenciesCodesList = [ currencyCodeFrom, currencyCodeTo ];
            const supportedCurrenciesCodes = await this.listSupportedCurrencies();

            if (!Utils.arrayAContainsB(supportedCurrenciesCodes, currenciesCodesList)) {
                throw { unknow_source: true };
            }

            if (currencyCodeFrom === currencyCodeTo) return amount;

            const ficticiousCurrenciesList = await this.CurrencyDB.listCurrenciesQuoteByCode(currencyCodeFrom, currencyCodeTo);

            if (ficticiousCurrenciesList.length == 2) {
                const [ currencyFrom, currencyTo ] = ficticiousCurrenciesList;
                
                return this._convertAmount(currencyFrom.currencyQuote, currencyTo.currencyQuote, amount);
            }

            return;
        } catch (err) {
            throw err;
        }
    }
}