import Utils from "../libs/Utils";

export default class Currency {
    constructor (CurrencyDB, CurrencyQuoteAPI, Cache) {
        this.CurrencyDB = CurrencyDB;
        this.CurrencyQuoteAPI = CurrencyQuoteAPI;
        this.Cache = Cache;
    }

    _isFictitiousCurrency (currencyDTO) {
        return currencyDTO.currencyQuote;
    }

    _groupCurrenciesCodesInfoByType (currenciesCodes, ficticiousCurrenciesList) {
        const currenciesCodesObj = {
            ficticious: [],
            real: []
        };
        
        currenciesCodes.reduce((acc, code) => {
            const isCurrentCodeFicticious = ficticiousCurrenciesList.find(currency => currency.currencyCode === code );
             
            (isCurrentCodeFicticious)
                ? acc.ficticious.push(code)
                : acc.real.push(code);

            return acc;
        }, currenciesCodesObj);

        return currenciesCodesObj;
    }

    _calculatesConvertedAmount (amount, currencyQuoteFrom, currencyQuoteTo) {
        const amountAtBase = amount * currencyQuoteFrom;
        
        return +(amountAtBase / currencyQuoteTo).toFixed(2);
    }

    async checkSupportedCurrenciesCodes (...currenciesCodesList) {
        try {
            const supportedCurrenciesCodes = await this.listSupportedCurrencies();

            return Utils.arrayAContainsB(supportedCurrenciesCodes, currenciesCodesList);
        } catch (err) {
            throw err;
        }
    }

    async listSupportedCurrencies () {
        try {
            let supportedCurrencies = this.Cache.get('supportedCurrencies');

            if (supportedCurrencies) return supportedCurrencies;

            const currenciesList = await this.CurrencyDB.listCurrencies();
            supportedCurrencies = currenciesList.map(currency => currency.currencyCode);
            
            this.Cache.set({ supportedCurrencies });

            return supportedCurrencies;
        } catch (err) {
            throw err;
        }
    }

    async listBackingCurrency () {
        try {
            const backingCurrency = await this.CurrencyDB.listBackingCurrency();

            backingCurrency.currencyQuote = 1;

            return backingCurrency;
        } catch (err) {
            throw err;
        }
    }

    async listFicticiousCurrenciesByCode (...currenciesCodes) {
        try {
            const currenciesList = await this.CurrencyDB.listCurrenciesQuoteByCode(...currenciesCodes);

            return currenciesList.filter(currency => this._isFictitiousCurrency(currency));
        } catch (err) {
            throw err;
        }
    }

    listRealCurrenciesByCode (backingCurrencyCode, currenciesCodes) {
        return this.CurrencyQuoteAPI.listCurrenciesQuoteByCode(backingCurrencyCode, ...currenciesCodes);
    }

    async retrieveCurrenciesInfo (...currenciesCodes) {
        try {
            const currenciesList = [];
            const backingCurrency = await this.listBackingCurrency();
            const backingCurrencyIndex = currenciesCodes.indexOf(backingCurrency.currencyCode);

            if (backingCurrencyIndex !== -1) {
                currenciesList.push(backingCurrency);
                currenciesCodes.splice(backingCurrencyIndex, 1);
            }

            const ficticiousCurrenciesList = await this.listFicticiousCurrenciesByCode(...currenciesCodes);
                
            if (ficticiousCurrenciesList.length == currenciesCodes.length) {
                return currenciesList.concat(ficticiousCurrenciesList);
            }

            const currenciesCodesObj = this._groupCurrenciesCodesInfoByType(currenciesCodes, ficticiousCurrenciesList);
            const realCurrenciesList = await this.listRealCurrenciesByCode(backingCurrency.currencyCode, currenciesCodesObj.real);

            if (realCurrenciesList.length != currenciesCodesObj.real.length) {
                throw { unknow_source: true };
            }

            return currenciesList.concat(ficticiousCurrenciesList, realCurrenciesList);
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
        const convertedObj = {
            amount,
            currencyCode: currencyCodeTo
        };
    
        try {
            const currenciesCodesSuported = await this.checkSupportedCurrenciesCodes(currencyCodeFrom, currencyCodeTo);

            if (!currenciesCodesSuported) {
                throw { unknow_source: true };
            }

            if (currencyCodeFrom === currencyCodeTo) {
                return convertedObj;
            }

            let currencyFrom, currencyTo;
            const currenciesList = await this.retrieveCurrenciesInfo(currencyCodeFrom, currencyCodeTo);

            currenciesList.map(currency => (currency.currencyCode === currencyCodeFrom) ? currencyFrom = currency : currencyTo = currency);

            convertedObj.amount = this._calculatesConvertedAmount(amount, currencyFrom.currencyQuote, currencyTo.currencyQuote);

            return convertedObj;
        } catch (err) {
            throw err;
        }
    }
}