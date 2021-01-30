const ConversionService = require('../../src/services/ConversionService')
const Conversion = require('../../src/interfaces/Conversion')
const assert = require('assert').strict;

describe('ConversionService', () => {
    it('should get the latest conversion rates', async () =>{
        const mock = {
            coinGeckoService: {},
            conversionRepository: {
                getLatest: function () {
                    return {
                        "_id": "601490041639827c937b2731",
                        "referenceDate": "2021-01-29T22:45:24.220Z",
                        "usd": 1,
                        "brl": 1,
                        "eur": 1,
                        "eth": 1,
                        "btc": 1
                    }
                }
            },
            currencyRepository: {}
        }
        const conversionService = new ConversionService(mock);
        const result = await conversionService.getLatestConversionRate();

        assert.deepStrictEqual(result, {
            "_id": "601490041639827c937b2731",
            "referenceDate": "2021-01-29T22:45:24.220Z",
            "usd": 1,
            "brl": 1,
            "eur": 1,
            "eth": 1,
            "btc": 1
        })
    })
''
    it('should convert usd to a brl', async () => {
        mock = {
            coinGeckoService: {},
            conversionRepository: {
                getLatest: function () {
                    return {
                        "_id": "601490041639827c937b2731",
                        "referenceDate": "2021-01-29T22:45:24.220Z",
                        "usd": 2,
                        "brl": 1,
                        "eur": 1,
                        "eth": 1,
                        "btc": 1
                    }
                }
            },
            currencyRepository: {}
        }
        const conversionService = new ConversionService(mock);
        const result = await conversionService.convertFromTo('brl', 'usd', 100);
        // bypass date
        result.referenceDate = new Date('2021-01-29T22:45:24.220Z');
        assert.deepStrictEqual(result, new Conversion('brl', 'usd', 100, 200, new Date('2021-01-29T22:45:24.220Z')));
    })
})