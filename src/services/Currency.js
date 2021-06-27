import Utils from "../libs/Utils";

export default class Currency {
    constructor (CurrencyDB) {
        this.CurrencyDB = CurrencyDB;
    }

    _isFictitiousCurrency (currencyDTO) {
        return currencyDTO.currencyQuote;
    }

    async _checkSupportedCurrenciesCodes (...currenciesCodesList) {
        try {
            const supportedCurrenciesCodes = await this.listSupportedCurrencies();

            return Utils.arrayAContainsB(supportedCurrenciesCodes, currenciesCodesList);
        } catch (err) {
            throw err;
        }
    }

    async _retrieveCurrenciesInfo (...currenciesCodes) {
        try {
            const ficticiousCurrenciesList = await this.CurrencyDB.listCurrenciesQuoteByCode(...currenciesCodes);
                
            if (ficticiousCurrenciesList.length == 2) {
                return ficticiousCurrenciesList;
            }

            return;
        } catch (err) {
            throw err;
        }
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
            const currenciesCodesSuported = await this._checkSupportedCurrenciesCodes(currencyCodeFrom, currencyCodeTo);

            if (!currenciesCodesSuported) {
                throw { unknow_source: true };
            }

            if (currencyCodeFrom === currencyCodeTo) return amount;

            const [ currencyFrom, currencyTo ] = await this._retrieveCurrenciesInfo(currencyCodeFrom, currencyCodeTo);

            return this._convertAmount(currencyFrom.currencyQuote, currencyTo.currencyQuote, amount);
        } catch (err) {
            throw err;
        }
    }
}