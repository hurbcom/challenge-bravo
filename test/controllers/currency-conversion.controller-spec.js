/* eslint-env node, mocha */
import { expect } from 'chai';
import { calculateExchange } from '../../src/controllers/currency-conversion.controller';

describe('Teste unitário: currency-conversion.controller', () => {
    describe('calculateExchange(from, to, amount)', () => {
        it('Deve realizar a conversão e retornar um json: { convertedValue: 10.00, error: false }', () => {
            const result = calculateExchange(10, 1, 100);
            expect(result).to.have.property('error').equal(false);
            expect(result).to.have.property('convertedValue').equal('10.00');
        });

        it('Deve retornar ERROR pelo fato do valor de FROM ser menor ou igual ZERO', () => {
            const result = calculateExchange(-1, 1, 100);
            expect(result).to.have.property('error').equal(true);
            expect(result).to.have.property('convertedValue').equal('0');
        });

        it('Deve retornar ERROR pelo fato do valor de TO ser menor ou igual ZERO', () => {
            const result = calculateExchange(10, 0, 100);
            expect(result).to.have.property('error').equal(true);
            expect(result).to.have.property('convertedValue').equal('0');
        });

        it('Deve retornar ERROR pelo fato do valor de AMOUT ser menor ou igual ZERO', () => {
            const result = calculateExchange(10, 1, -1);
            expect(result).to.have.property('error').equal(true);
            expect(result).to.have.property('convertedValue').equal('0');
        });
    });
});
