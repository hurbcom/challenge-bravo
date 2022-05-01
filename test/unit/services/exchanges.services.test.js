const exchangesService = require('../../../services/exchanges.services');
const { generateCurrency } = require('../../factories/currencies.factories');

describe('Exchanges Service', () => {
    describe('convert method', () => {
        it('should contain convert function', () => {
            expect(typeof exchangesService.convert).toBe('function');
        });
        it('should convert amount', () => {
            const fromCurrency = generateCurrency('FROM', 1.4);
            const toCurrency = generateCurrency('TO', 4.90);
            const result = exchangesService.convert(fromCurrency, toCurrency, 1);

            // dealing with floating point precision
            expect(result.toPrecision(2)).toBe('3.5');
        });
    });
});
