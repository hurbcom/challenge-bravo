/* eslint-env node, mocha */
import { expect } from 'chai';
import { calculateExchange } from '../src/controllers/currency-conversion.controller';

describe('currency-conversion.controller', () => {
    describe('calculateExchange(from, to, amount)', () => {
        it('Deve realizar a conversão convertedValue: 10.00 e error: false ', () => {
            const result = calculateExchange(10, 1, 100);
            expect(result).to.have.property('error').equal(false);
            expect(result).to.have.property('convertedValue').equal('10.00');
        });
    });
});
