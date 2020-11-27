import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ConversionService from '../../../src/services/conversion.service';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('services/conversion.service.js', () => {
    let service;

    beforeEach(() => {
        const getRatesFromApiMock = () => ({
            'BRL': 5,
            'EUR': 0.8
        });
        
        service = new ConversionService(getRatesFromApiMock);
    });

    describe('calculateExchangeRate()', () => {

        describe('Given that all parameters are correct', () => {
            const testCases = [
                { 
                    amount: 10, 
                    to: 1.6, 
                    reference: 2
                }
            ];

            for (const expected of testCases) {
                it(`should return 'BRL: ${expected.amount}, EUR: ${expected.to}, USD: ${expected.reference}`, async () => {
                    
                    const conversion = await service.calculateExchangeRate({ 
                        from: 'BRL', 
                        to: 'EUR', 
                        amount: expected.amount, 
                        reference: 'USD'
                    });

                    expect(conversion).to.eql({
                        'BRL': expected.amount,
                        'EUR': expected.to,
                        'USD': expected.reference
                    });
                });
            }
        });
    });
});