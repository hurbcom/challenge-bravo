const CurrencyService = require('../../src/services/CurrencyService');
const Currency = require('../../src/models/Currency');
const coinGeckoServiceGetAllMock = require('../fixtures/coinGeckoMockJson.json');
const mockedListCurrencies = require('../fixtures/currencyList.json');
const mockedCurrency = require('../fixtures/currencyfindByOne.json');
const mockedConversionRates = require('../fixtures/updateConversionRate.json');

const assert = require('assert').strict;

describe('CurrencyService', () => {
    const dependenciesMock = {
        currencyRepository: {
            list: function () {
                return mockedListCurrencies
            },
            findByKey: function () {
                return mockedCurrency
            },
            insert: function() { return },
            delete: function () { return }
        },
        coinGeckoService: {},
        conversionRepository: {
            updateConversionRates: function () {
                return mockedConversionRates
            }
        }
    }

    it('should get all the currencies', async () =>{    
        const currencyService = new CurrencyService(dependenciesMock);
        const result = await currencyService.listCurrencies();
        assert.deepStrictEqual(result, [
            {
                "_id": "60171ed3b148061ff7bb34d7",
                "key": "usd",
                "name": "US Dollar",
                "unit": "$",
                "type": "fiat"
            },
            {
                "_id": "60171ed3b148061ff7bb34d9",
                "key": "brl",
                "name": "Brazil Real",
                "unit": "R$",
                "type": "fiat"
            },
            {
                "_id": "60171ed3b148061ff7bb34db",
                "key": "eur",
                "name": "Euro",
                "unit": "€",
                "type": "fiat"
            },
            {
                "_id": "60171ed3b148061ff7bb34dd",
                "key": "eth",
                "name": "Ether",
                "unit": "ETH",
                "type": "crypto"
            },
            {
                "_id": "60171ed3b148061ff7bb34df",
                "key": "btc",
                "name": "Bitcoin",
                "unit": "BTC",
                "type": "crypto"
            }
        ])
    })

    it('should add a new currency', async () => {
        const currencyService = new CurrencyService(dependenciesMock);
        const result = await currencyService.addCurrency('GPB');
        assert.deepStrictEqual(result, {
            "key": "gbp",
            "name": "British Pound Sterling",
            "unit": "£",
            "type": "fiat",
            "_id": "601721494606242541840ac0"
        })
    })

    it('should get a currency', async () => {
        const currencyService = new CurrencyService(dependenciesMock);
        const result = await currencyService.getCurrency('GPB');
        assert.deepStrictEqual(result, {
            "key": "gbp",
            "name": "British Pound Sterling",
            "unit": "£",
            "type": "fiat",
            "_id": "601721494606242541840ac0"
        })
    })

    it('should remove a currency', async () => {
        const currencyService = new CurrencyService(dependenciesMock);
        const result = await currencyService.getCurrency('GPB');
        assert.deepStrictEqual(result, {
            "key": "gbp",
            "name": "British Pound Sterling",
            "unit": "£",
            "type": "fiat",
            "_id": "601721494606242541840ac0"
        })
    })
})