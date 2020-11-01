import { assert, expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import { Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import Big from 'big.js';
import ExchangeController from '../../src/controllers/exchange';
import ExchangeService from '../../src/services/exchange';

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

    describe('Exchange: GET', () => {
        it('should fail when providing an invalid parameter', async () => {
            const exchangeService = <ExchangeService>{};

            const exchangeController = new ExchangeController(exchangeService);

            const req = <Request>{
                query: <qs.ParsedQs>{
                    from: 'BRL',
                    to: 'USD',
                },
            };

            const res = <Response>{};

            const statusMock = sandbox.mock().returns(res);
            res.status = statusMock;

            const sendMock = sandbox.mock();
            res.send = sendMock;

            await exchangeController.exchange(req, res);

            expect(statusMock.calledOnceWith(StatusCodes.BAD_REQUEST)).to.be.true;
            expect(sendMock.calledOnce).to.be.true;
        });

        it('should fail when providing an unsupported currency as final currency', async () => {
            const exchangeService = <ExchangeService>{};

            const getSupportedCurrenciesMock = sandbox.mock().returns(['BRL']);
            exchangeService.getSupportedCurrencies = getSupportedCurrenciesMock;

            const exchangeController = new ExchangeController(exchangeService);

            const req = <Request>{
                query: <qs.ParsedQs>{
                    from: 'BRL',
                    to: 'USD',
                    amount: '5',
                },
            };

            const res = <Response>{};

            const statusMock = sandbox.mock().returns(res);
            res.status = statusMock;

            const sendMock = sandbox.mock();
            res.send = sendMock;

            await exchangeController.exchange(req, res);

            expect(statusMock.calledOnceWith(StatusCodes.BAD_REQUEST)).to.be.true;
            expect(sendMock.calledOnce).to.be.true;
        });

        it('should fail when providing an unsupported currency as original currency', async () => {
            const exchangeService = <ExchangeService>{};

            const getSupportedCurrenciesMock = sandbox.mock().returns(['USD']);
            exchangeService.getSupportedCurrencies = getSupportedCurrenciesMock;

            const exchangeController = new ExchangeController(exchangeService);

            const req = <Request>{
                query: <qs.ParsedQs>{
                    from: 'BRL',
                    to: 'USD',
                    amount: '5',
                },
            };

            const res = <Response>{};

            const statusMock = sandbox.mock().returns(res);
            res.status = statusMock;

            const sendMock = sandbox.mock();
            res.send = sendMock;

            await exchangeController.exchange(req, res);

            expect(statusMock.calledOnceWith(StatusCodes.BAD_REQUEST)).to.be.true;
            expect(sendMock.calledOnce).to.be.true;
        });

        it('should fail when none of the currencies provided are supported', async () => {
            const exchangeService = <ExchangeService>{};

            const getSupportedCurrenciesMock = sandbox.mock().returns([]);
            exchangeService.getSupportedCurrencies = getSupportedCurrenciesMock;

            const exchangeController = new ExchangeController(exchangeService);

            const req = <Request>{
                query: <qs.ParsedQs>{
                    from: 'BRL',
                    to: 'USD',
                    amount: '5',
                },
            };

            const res = <Response>{};

            const statusMock = sandbox.mock().returns(res);
            res.status = statusMock;

            const sendMock = sandbox.mock();
            res.send = sendMock;

            await exchangeController.exchange(req, res);

            expect(statusMock.calledOnceWith(StatusCodes.BAD_REQUEST)).to.be.true;
            expect(sendMock.calledOnce).to.be.true;
        });

        it('should fail when providing a non monetary value as amount', async () => {
            const exchangeService = <ExchangeService>{};

            const getSupportedCurrenciesMock = sandbox.mock().returns(['BRL', 'USD']);
            exchangeService.getSupportedCurrencies = getSupportedCurrenciesMock;

            const exchangeController = new ExchangeController(exchangeService);

            const req = <Request>{
                query: <qs.ParsedQs>{
                    from: 'BRL',
                    to: 'USD',
                    amount: '5.123.456',
                },
            };

            const res = <Response>{};

            const statusMock = sandbox.mock().returns(res);
            res.status = statusMock;

            const sendMock = sandbox.mock();
            res.send = sendMock;

            await exchangeController.exchange(req, res);

            expect(statusMock.calledOnceWith(StatusCodes.BAD_REQUEST)).to.be.true;
            expect(sendMock.calledOnce).to.be.true;
        });

        it('should fail when an error is raised by the service', async () => {
            const exchangeService = <ExchangeService>{};

            const exchangeMock = sandbox.mock().throws();
            exchangeService.exchange = exchangeMock;

            const getSupportedCurrenciesMock = sandbox.mock().returns(['BRL', 'USD']);
            exchangeService.getSupportedCurrencies = getSupportedCurrenciesMock;

            const exchangeController = new ExchangeController(exchangeService);

            const req = <Request>{
                query: <qs.ParsedQs>{
                    from: 'BRL',
                    to: 'USD',
                    amount: '5',
                },
            };

            const res = <Response>{};

            const statusMock = sandbox.mock().returns(res);
            res.status = statusMock;

            const sendMock = sandbox.mock();
            res.send = sendMock;

            await exchangeController.exchange(req, res);

            expect(statusMock.calledOnceWith(StatusCodes.INTERNAL_SERVER_ERROR)).to.be.true;
            expect(sendMock.calledOnce).to.be.true;
        });

        it('should pass, successfully providing the exchange rates', async () => {
            const exchangeService = <ExchangeService>{};

            const exchangeMock = sandbox
                .mock()
                .returns({
                    originalCurrency: 'BRL',
                    finalCurrency: 'USD',
                    rate: Big('3'),
                    amount: Big('5'),
                    result: Big('15'),
                });
            exchangeService.exchange = exchangeMock;

            const getSupportedCurrenciesMock = sandbox.mock().returns(['BRL', 'USD']);
            exchangeService.getSupportedCurrencies = getSupportedCurrenciesMock;

            const exchangeController = new ExchangeController(exchangeService);

            const req = <Request>{
                query: <qs.ParsedQs>{
                    from: 'BRL',
                    to: 'USD',
                    amount: '5',
                },
            };

            const res = <Response>{};

            const jsonMock = sandbox.mock();
            res.json = jsonMock;

            await exchangeController.exchange(req, res);

            expect(exchangeMock.calledOnceWith('BRL', 'USD', Big(5))).to.be.true;

            expect(
                jsonMock.calledOnceWith({
                    from: 'BRL',
                    to: 'USD',
                    rate: '3.00',
                    amount: '5.00',
                    result: '15.00',
                })
            ).to.be.true;
        });
    });

    describe('Supported Currencies: GET', () => {
        it('should pass, successfully providing the supported currencies', async () => {
            const exchangeService = <ExchangeService>{};

            const getSupportedCurrenciesMock = sandbox.mock().returns(['BRL', 'USD']);
            exchangeService.getSupportedCurrencies = getSupportedCurrenciesMock;

            const exchangeController = new ExchangeController(exchangeService);

            const req = <Request>{};
            const res = <Response>{};

            const jsonMock = sandbox.mock();
            res.json = jsonMock;

            await exchangeController.getSupportedCurrencies(req, res);

            expect(getSupportedCurrenciesMock.calledOnce).to.be.true;

            expect(jsonMock.calledOnceWith(['BRL', 'USD'])).to.be.true;
        });

        it('should fail when an error is raised by the service', async () => {
            const exchangeService = <ExchangeService>{};

            const getSupportedCurrenciesMock = sandbox.mock().throws();
            exchangeService.getSupportedCurrencies = getSupportedCurrenciesMock;

            const exchangeController = new ExchangeController(exchangeService);

            const req = <Request>{};
            const res = <Response>{};

            const statusMock = sandbox.mock().returns(res);
            res.status = statusMock;

            const sendMock = sandbox.mock();
            res.send = sendMock;

            await exchangeController.getSupportedCurrencies(req, res);

            expect(getSupportedCurrenciesMock.calledOnce).to.be.true;

            expect(statusMock.calledOnceWith(StatusCodes.INTERNAL_SERVER_ERROR)).to.be.true;
            expect(sendMock.calledOnce).to.be.true;
        });
    });

    describe('Supported Currencies: POST', () => {
        it('should pass, successfully adding support to the provided currencies', async () => {
            const exchangeService = <ExchangeService>{};

            const getAvailableCurrenciesMock = sandbox.mock().resolves(['BRL', 'USD', 'EUR', 'BTC']);
            exchangeService.getAvailableCurrencies = getAvailableCurrenciesMock;

            const getSupportedCurrenciesStub = sandbox.stub();
            getSupportedCurrenciesStub.onCall(0).resolves(['USD']);
            getSupportedCurrenciesStub.onCall(1).resolves(['USD', 'EUR', 'BTC']);
            exchangeService.getSupportedCurrencies = getSupportedCurrenciesStub;

            const addSupportedCurrenciesMock = sandbox.mock().resolves();
            exchangeService.addSupportedCurrencies = addSupportedCurrenciesMock;

            const exchangeController = new ExchangeController(exchangeService);

            const req = <Request>{
                body: ['EUR', 'BTC'],
            };
            const res = <Response>{};

            const jsonMock = sandbox.mock();
            res.json = jsonMock;

            await exchangeController.addSupportedCurrencies(req, res);

            expect(addSupportedCurrenciesMock.calledOnceWith(req.body)).to.be.true;

            expect(jsonMock.calledOnceWith(['USD', 'EUR', 'BTC'])).to.be.true;
        });

        it('should fail when one of the currencies provided is not available to be supported', async () => {
            const exchangeService = <ExchangeService>{};

            const getAvailableCurrenciesMock = sandbox.mock().resolves(['EUR']);
            exchangeService.getAvailableCurrencies = getAvailableCurrenciesMock;

            const exchangeController = new ExchangeController(exchangeService);

            const req = <Request>{
                body: ['EUR', 'BTC'],
            };
            const res = <Response>{};

            const statusMock = sandbox.mock().returns(res);
            res.status = statusMock;

            const sendMock = sandbox.mock();
            res.send = sendMock;

            await exchangeController.addSupportedCurrencies(req, res);

            expect(statusMock.calledOnceWith(StatusCodes.BAD_REQUEST)).to.be.true;
            expect(sendMock.calledOnce).to.be.true;
        });

        it('should fail when no currency is provided in the body of the request', async () => {
            const exchangeService = <ExchangeService>{};

            const exchangeController = new ExchangeController(exchangeService);

            const req = <Request>{
                body: [],
            };
            const res = <Response>{};

            const statusMock = sandbox.mock().returns(res);
            res.status = statusMock;

            const sendMock = sandbox.mock();
            res.send = sendMock;

            await exchangeController.addSupportedCurrencies(req, res);

            expect(statusMock.calledOnceWith(StatusCodes.BAD_REQUEST)).to.be.true;
            expect(sendMock.calledOnce).to.be.true;
        });
    });

    describe('Supported Currencies: DELETE', () => {
        it('should pass, successfully removing support to the provided currencies', async () => {
            const exchangeService = <ExchangeService>{};

            const getSupportedCurrenciesStub = sandbox.stub();
            getSupportedCurrenciesStub.onCall(0).resolves(['USD', 'EUR', 'BTC']);
            getSupportedCurrenciesStub.onCall(1).resolves(['USD']);
            exchangeService.getSupportedCurrencies = getSupportedCurrenciesStub;

            const removeSupportedCurrenciesMock = sandbox.mock().resolves();
            exchangeService.removeSupportedCurrencies = removeSupportedCurrenciesMock;

            const exchangeController = new ExchangeController(exchangeService);

            const req = <Request>{
                body: ['EUR', 'BTC'],
            };
            const res = <Response>{};

            const jsonMock = sandbox.mock();
            res.json = jsonMock;

            await exchangeController.removeSupportedCurrencies(req, res);

            expect(removeSupportedCurrenciesMock.calledOnceWith(req.body)).to.be.true;

            expect(jsonMock.calledOnceWith(['USD'])).to.be.true;
        });

        it('should fail when one of the currencies provided to be removed is not actually supported', async () => {
            const exchangeService = <ExchangeService>{};

            const getSupportedCurrenciesStub = sandbox.stub().resolves(['EUR']);
            exchangeService.getSupportedCurrencies = getSupportedCurrenciesStub;

            const exchangeController = new ExchangeController(exchangeService);

            const req = <Request>{
                body: ['EUR', 'BTC'],
            };
            const res = <Response>{};

            const statusMock = sandbox.mock().returns(res);
            res.status = statusMock;

            const sendMock = sandbox.mock();
            res.send = sendMock;

            await exchangeController.removeSupportedCurrencies(req, res);

            expect(statusMock.calledOnceWith(StatusCodes.BAD_REQUEST)).to.be.true;
            expect(sendMock.calledOnce).to.be.true;
        });

        it('should fail when no currency is provided in the body of the request', async () => {
            const exchangeService = <ExchangeService>{};

            const exchangeController = new ExchangeController(exchangeService);

            const req = <Request>{
                body: [],
            };
            const res = <Response>{};

            const statusMock = sandbox.mock().returns(res);
            res.status = statusMock;

            const sendMock = sandbox.mock();
            res.send = sendMock;

            await exchangeController.removeSupportedCurrencies(req, res);

            expect(statusMock.calledOnceWith(StatusCodes.BAD_REQUEST)).to.be.true;
            expect(sendMock.calledOnce).to.be.true;
        });
    });
});
