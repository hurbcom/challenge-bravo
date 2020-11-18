import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ConversionService from '../../../src/services/conversion.service';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('services/conversion.service.js', () => {
    const reference = 'USD';
    let service;

    beforeEach(() => {
        const getRatesFromApiMock = () => ({
            'BRL': 5.36,
            'EUR': 0.841
        });
        
        service = ConversionService({
            getRates: getRatesFromApiMock
        });
    });

    describe('calculateExchangeRate()', () => {

        describe('Given that all parameters are correct', () => {
            const testCases = [
                { 
                    amount: 1, 
                    to: 0.15690298507462686, 
                    rate: 0.15690298507462686 
                }
            ];

            for (const expected of testCases) {
                it(`should return 'BRL: ${expected.amount}, EUR: ${expected.to}, USD: ${expected.rate}`, async () => {
                    
                    const conversion = await service.calculateExchangeRate({ 
                        from: 'BRL', 
                        to: 'EUR', 
                        amount: expected.amount, 
                        reference 
                    });

                    expect(conversion).to.eql({
                        'BRL': expected.amount,
                        'EUR': expected.to,
                        'USD': expected.rate
                    });
                });
            }
        });
    });
});