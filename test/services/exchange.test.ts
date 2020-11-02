import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import Big from 'big.js';
import ExchangeService from '../../src/services/exchange';
import CurrencyCache from '../../src/cache/currencyCache';
import CoinbaseIntegration from '../../src/integrations/coinbaseIntegration';
import { fail } from 'assert';

describe('Exchange Controller', () => {
    let sandbox: SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();

        // suppress error logs from Mocha output
        sandbox.stub(console, 'error');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('Exchange', () => {
        it('should pass, successfully retrieving the exchange rate from the integration and caching it', async () => {
            const currencyCache = <CurrencyCache>{};
            const coinbaseIntegration = <CoinbaseIntegration>{};

            const integrationResponse = {
                rates: {
                    USD: '0.17',
                    EUR: '0.14',
                },
            };

            const amount = Big('3.50');
            const rate = Big('0.17');

            const cacheGetCurrencyExchangeRateMock = sandbox.mock().returns(undefined);
            currencyCache.getCurrencyExchangeRate = cacheGetCurrencyExchangeRateMock;

            const integrationGetCurrencyExchangeRateMock = sandbox.mock().resolves(integrationResponse);
            coinbaseIntegration.getCurrencyExchangeRate = integrationGetCurrencyExchangeRateMock;

            const cacheSetCurrencyExchangeRateMock = sandbox.mock();
            currencyCache.setCurrencyExchangeRates = cacheSetCurrencyExchangeRateMock;

            const eschangeService = new ExchangeService(currencyCache, coinbaseIntegration);

            const exchangeRate = await eschangeService.exchange('BRL', 'USD', amount);

            expect(cacheGetCurrencyExchangeRateMock.calledOnceWith('BRL', 'USD')).to.be.true;
            expect(integrationGetCurrencyExchangeRateMock.called).to.be.true;
            expect(cacheSetCurrencyExchangeRateMock.calledOnceWith('BRL', integrationResponse.rates)).to.be.true;
            expect(exchangeRate).to.be.deep.equal({
                originalCurrency: 'BRL',
                finalCurrency: 'USD',
                amount,
                rate,
                result: rate.times(amount),
            });
        });

        it('should pass, successfully providing the exchange rate from the cache', async () => {
            const currencyCache = <CurrencyCache>{};
            const coinbaseIntegration = <CoinbaseIntegration>{};

            const amount = Big('3.50');
            const rate = Big('0.17');

            const cacheGetCurrencyExchangeRateMock = sandbox.mock().returns(rate);
            currencyCache.getCurrencyExchangeRate = cacheGetCurrencyExchangeRateMock;

            const integrationGetCurrencyExchangeRateMock = sandbox.mock();
            coinbaseIntegration.getCurrencyExchangeRate = integrationGetCurrencyExchangeRateMock;

            const eschangeService = new ExchangeService(currencyCache, coinbaseIntegration);

            const exchangeRate = await eschangeService.exchange('BRL', 'USD', amount);

            expect(cacheGetCurrencyExchangeRateMock.calledOnceWith('BRL', 'USD')).to.be.true;
            expect(integrationGetCurrencyExchangeRateMock.called).to.be.false;
            expect(exchangeRate).to.be.deep.equal({
                originalCurrency: 'BRL',
                finalCurrency: 'USD',
                amount,
                rate,
                result: rate.times(amount),
            });
        });

        it('should fail when an error is raised by the cache', async () => {
            const currencyCache = <CurrencyCache>{};
            const coinbaseIntegration = <CoinbaseIntegration>{};

            const cacheGetCurrencyExchangeRateMock = sandbox.mock().throws();
            currencyCache.getCurrencyExchangeRate = cacheGetCurrencyExchangeRateMock;

            const eschangeService = new ExchangeService(currencyCache, coinbaseIntegration);

            try {
                await eschangeService.exchange('BRL', 'USD', Big('3.50'));
                fail('It should have thrown an exception');
            } catch (err) {
                expect(cacheGetCurrencyExchangeRateMock.calledOnceWith('BRL', 'USD')).to.be.true;
            }
        });

        it('should fail when an error is raised by the integration', async () => {
            const currencyCache = <CurrencyCache>{};
            const coinbaseIntegration = <CoinbaseIntegration>{};

            const amount = Big('3.50');
            const rate = Big('0.17');

            const cacheGetCurrencyExchangeRateMock = sandbox.mock().returns(undefined);
            currencyCache.getCurrencyExchangeRate = cacheGetCurrencyExchangeRateMock;

            const integrationGetCurrencyExchangeRateMock = sandbox.mock().throws();
            coinbaseIntegration.getCurrencyExchangeRate = integrationGetCurrencyExchangeRateMock;

            const eschangeService = new ExchangeService(currencyCache, coinbaseIntegration);

            try {
                await eschangeService.exchange('BRL', 'USD', amount);
                fail('It should have thrown an exception');
            } catch (err) {
                expect(cacheGetCurrencyExchangeRateMock.calledOnceWith('BRL', 'USD')).to.be.true;
                expect(integrationGetCurrencyExchangeRateMock.called).to.be.true;
            }
        });
    });

    describe('Get available currencies', () => {
        it('should pass, retrieving the available currencies directly from the cache', async () => {
            const currencyCache = <CurrencyCache>{};
            const coinbaseIntegration = <CoinbaseIntegration>{};

            const cacheGetAvailableCurrenciesMock = sandbox.mock().returns(['USD', 'BRL', 'EUR']);
            currencyCache.getAvailableCurrencies = cacheGetAvailableCurrenciesMock;

            const eschangeService = new ExchangeService(currencyCache, coinbaseIntegration);

            const availableCurrencies = await eschangeService.getAvailableCurrencies();

            expect(availableCurrencies).to.be.deep.equal(['USD', 'BRL', 'EUR']);
            expect(cacheGetAvailableCurrenciesMock.calledOnce).to.be.true;
        });

        it('should pass, retrieving the available currencies from the API and storing it on the cache', async () => {
            const currencyCache = <CurrencyCache>{};
            const coinbaseIntegration = <CoinbaseIntegration>{};

            const cacheGetAvailableCurrenciesMock = sandbox.mock().returns([]);
            currencyCache.getAvailableCurrencies = cacheGetAvailableCurrenciesMock;

            const integrationGetAvailableCurrenciesMock = sandbox.mock().returns(['USD', 'BRL', 'EUR']);
            coinbaseIntegration.getAvailableCurrencies = integrationGetAvailableCurrenciesMock;

            const cacheSetAvailableCurrenciesMock = sandbox.mock();
            currencyCache.setAvailableCurrencies = cacheSetAvailableCurrenciesMock;

            const eschangeService = new ExchangeService(currencyCache, coinbaseIntegration);

            const availableCurrencies = await eschangeService.getAvailableCurrencies();

            expect(availableCurrencies).to.be.deep.equal(['USD', 'BRL', 'EUR']);
            expect(cacheGetAvailableCurrenciesMock.calledOnce).to.be.true;
            expect(cacheSetAvailableCurrenciesMock.calledOnceWith(['USD', 'BRL', 'EUR'])).to.be.true;
        });

        it('should fail when an error is raised by the integration', async () => {
            const currencyCache = <CurrencyCache>{};
            const coinbaseIntegration = <CoinbaseIntegration>{};

            const cacheGetAvailableCurrenciesMock = sandbox.mock().returns([]);
            currencyCache.getAvailableCurrencies = cacheGetAvailableCurrenciesMock;

            const integrationGetAvailableCurrenciesMock = sandbox.mock().throws();
            coinbaseIntegration.getAvailableCurrencies = integrationGetAvailableCurrenciesMock;

            const eschangeService = new ExchangeService(currencyCache, coinbaseIntegration);

            try {
                await eschangeService.getAvailableCurrencies();
                fail('It should have thrown an exception');
            } catch (err) {
                expect(cacheGetAvailableCurrenciesMock.calledOnce).to.be.true;
                expect(integrationGetAvailableCurrenciesMock.calledOnce).to.be.true;
            }
        });

        it('should fail when an error is raised by the cache', async () => {
            const currencyCache = <CurrencyCache>{};
            const coinbaseIntegration = <CoinbaseIntegration>{};

            const cacheGetAvailableCurrenciesMock = sandbox.mock().throws();
            currencyCache.getAvailableCurrencies = cacheGetAvailableCurrenciesMock;

            const eschangeService = new ExchangeService(currencyCache, coinbaseIntegration);

            try {
                await eschangeService.getAvailableCurrencies();
                fail('It should have thrown an exception');
            } catch (err) {
                expect(cacheGetAvailableCurrenciesMock.calledOnce).to.be.true;
            }
        });
    });
});
