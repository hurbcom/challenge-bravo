export default class Currency {
    constructor (CurrencyDB, CurrencyQuoteAPI, Cache) {
        this.CurrencyDB = CurrencyDB;
        this.CurrencyQuoteAPI = CurrencyQuoteAPI;
        this.Cache = Cache;
    }

    _isFictitiousCurrency (currencyDTO) {
        return currencyDTO.currencyQuote;
    }

    _calculatesConvertedAmount (amount, currencyQuoteFrom, currencyQuoteTo) {
        const amountAtBase = amount * currencyQuoteFrom;
        
        return +(amountAtBase / currencyQuoteTo).toFixed(2);
    }

    async checkSupportedCurrenciesCodes (...currenciesCodesList) {
        try {
            const supportedCurrenciesCodes = await this.listSupportedCurrencies();

            return utils.arrayAContainsB(supportedCurrenciesCodes, currenciesCodesList);
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
            let backingCurrency = this.Cache.get('backingCurrency');
    
            if (backingCurrency) return backingCurrency;

            backingCurrency = await this.CurrencyDB.listBackingCurrency();

            backingCurrency.currencyQuote = 1;

            this.Cache.set({ backingCurrency });

            return backingCurrency;
        } catch (err) {
            throw err;
        }
    }

    async listFicticiousCurrenciesByCode (currenciesCodes) {
        try {
            let ficticiousCurrencies = this.Cache.get('ficticiousCurrencies');

            if (!ficticiousCurrencies) {
                ficticiousCurrencies = await this.CurrencyDB.listCurrenciesWithQuoteByCode();    

                this.Cache.set({ ficticiousCurrencies })
            }
            
            return ficticiousCurrencies.filter(currency => currenciesCodes.indexOf(currency.currencyCode) !== -1);
        } catch (err) {
            throw err;
        }
    }

    async listRealCurrenciesByCode (backingCurrencyCode, currenciesCodes) {
        try {
            let realCurrencies = this.Cache.get('realCurrencies');

            if (!realCurrencies) {
                const currenciesList = await this.CurrencyDB.listCurrenciesWithoutQuoteByCode();
                const realCurrenciesCodes = currenciesList.map(currency => currency.currencyCode);

                realCurrencies = await this.CurrencyQuoteAPI.listCurrenciesQuoteByCode(backingCurrencyCode, realCurrenciesCodes);
                
                this.Cache.set({ realCurrencies });
            }

            return realCurrencies.filter(currency => currenciesCodes.indexOf(currency.currencyCode) !== -1);
        } catch (err) {
            throw err;
        }
    }

    async retrieveCurrenciesInfo (...currenciesCodes) {
        try {
            const currenciesList = [];
            const backingCurrency = await this.listBackingCurrency();

            if (currenciesCodes.includes(backingCurrency.currencyCode)) {
                currenciesList.push(backingCurrency);
            }

            const ficticiousCurrenciesList = await this.listFicticiousCurrenciesByCode(currenciesCodes);
                
            currenciesList.push(...ficticiousCurrenciesList);

            if (currenciesList.length === currenciesCodes.length) {
                return currenciesList;
            }

            const realCurrenciesList = await this.listRealCurrenciesByCode(backingCurrency.currencyCode, currenciesCodes);

            currenciesList.push(...realCurrenciesList);

            if (currenciesList.length !== currenciesCodes.length) {
                throw { unknow_source: true };
            }

            return currenciesList;
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

            this.Cache.delete('supportedCurrencies');

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