const { expect } = require('chai')
const sinon = require('sinon')
const ConversionService = require('../../../api/currency/domain/services/ConversionService')

describe('Currency -> Domain -> Services -> ConversionService', () => {
    describe('Success path', () => {
        let ratesAPIMock, conversionService, conversionServiceDecimal, redisMock, loggerMock
        beforeEach(() => {
            ratesAPIMock = {
                getRates: async (currency) => (({ 'BRL': 1, 'EUR': 2 }))
            }

            redisMock = {
                set: (key, value) => [key, value],
                get: (key, fn) => {
                    fn(null, null)
                }
            }

            loggerMock = {
                info: (str) => str
            }

            ratesAPIMockDecimal = {
                getRates: async (currency) => ({ 'BRL': 1, 'EUR': 2.5 })
            }

            conversionService = ConversionService({
                ratesAPI: ratesAPIMock,
                redisClient: redisMock,
                logger: loggerMock
            })
            conversionServiceDecimal = ConversionService({
                ratesAPI: ratesAPIMockDecimal,
                redisClient: redisMock,
                logger: loggerMock
            })
        })

        describe('convert', () => {
            [
                { amount: 1, expected: 2 },
                { amount: 15, expected: 30 },
                { amount: 0.5, expected: 1 },
                { amount: 10000000, expected: 20000000 }
            ].forEach(e => {
                it(`should return ${e.expected} when amount is ${e.amount}`, async () => {
                    const response = await conversionService.convert({ abbreviation: 'BRL' },
                        { abbreviation: 'EUR' },
                        e.amount)
                    expect(response).to.equal(e.expected)
                })
            })
        })
    })
})