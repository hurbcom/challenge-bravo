const { expect } = require('chai')
const sinon = require('sinon')
const ConversionService = require('../../../api/currency/domain/services/ConversionService')

describe('Currency -> Domain -> Services -> ConversionService', () => {
    describe('Success path', () => {
        let ratesAPIMock, conversionService, conversionServiceDecimal
        beforeEach(() => {
            ratesAPIMock = {
                getRates: async (currency) => (({ 'BRL': 1, 'EUR': 2 }))
            }

            ratesAPIMockDecimal = {
                getRates: async (currency) => ({ 'BRL': 1, 'EUR': 2.5 })
            }

            conversionService = ConversionService({ ratesAPI: ratesAPIMock })
            conversionServiceDecimal = ConversionService({ ratesAPI: ratesAPIMockDecimal })
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