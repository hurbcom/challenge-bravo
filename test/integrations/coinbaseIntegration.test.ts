import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import nock from 'nock';
import CoinbaseIntegration from '../../src/integrations/coinbaseIntegration';
import { fail } from 'assert';

describe('Exchange controller', () => {
    let sandbox: SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();

        // suppress error logs from Mocha output
        sandbox.stub(console, 'error');
        sandbox.stub(console, 'info');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('Get Available Currencies', () => {
        it('should pass when the API responds as expected', async () => {
            const body = {
                data: [
                    {
                        id: 'BRL',
                        name: 'Brazilian Real',
                        min_size: '',
                    },
                    {
                        id: 'USD',
                        name: 'US Dollar',
                        min_size: '0.01000000',
                    }
                ]
            };

            nock('https://api.coinbase.com/v2').get('/currencies').reply(200, body);

            const coinbaseIntegration = new CoinbaseIntegration('https://api.coinbase.com/v2');

            const availableCurrencies = await coinbaseIntegration.getAvailableCurrencies();

            expect(availableCurrencies).deep.equal(['BRL', 'USD']);
        });

        it('should fail if the API responds with an unexpected data', async () => {
            const body = 'Some unexpected response';

            nock('https://api.coinbase.com/v2').get('/currencies').reply(200, body);

            const coinbaseIntegration = new CoinbaseIntegration('https://api.coinbase.com/v2');

            try{
                await coinbaseIntegration.getAvailableCurrencies();
                fail('It should have thrown an exception');
            } catch(err) {
                expect(err.message).to.be.equal('The API responded with an unexpected value.');
            }
        });
    });

    describe('Exchange', () => {
        it('should pass when the API responds as expected', async () => {
            const body = {
                data: {
                    currency: 'BRL',
                    rates: {
                        USD: '0.15',
                        EUR: '0.17'
                    }
                }
            };

            nock('https://api.coinbase.com/v2').get('/exchange-rates').query({currency: 'BRL'}).reply(200, body);

            const coinbaseIntegration = new CoinbaseIntegration('https://api.coinbase.com/v2');

            const exchangeRates = await coinbaseIntegration.getCurrencyExchangeRate('BRL');

            expect(exchangeRates).deep.equal(body.data);
        });

        it('should fail if the API responds with an unexpected data', async () => {
            const body = 'Some unexpected response';

            nock('https://api.coinbase.com/v2').get('/exchange-rates').query({currency: 'BRL'}).reply(200, body);

            const coinbaseIntegration = new CoinbaseIntegration('https://api.coinbase.com/v2');

            try {
                await coinbaseIntegration.getCurrencyExchangeRate('BRL');
                fail('It should have thrown an exception');
            } catch(err) {
                expect(err.message).to.be.equal('The API responded with an unexpected value.');
            }
        });
    });
});
