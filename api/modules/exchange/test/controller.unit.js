const { expect } = require('chai');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const Controller = require('../controller');

before(() => chai.use(sinonChai));


describe('Exchange Controller', () => {

    let sandbox;
    let subject;
    let getConversionStub;
    let getUpdateTimeStub;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        subject = new Controller();
        getUpdateTimeStub = sandbox.stub(subject.exchangeService, 'checkUpdateTime').resolves('2021-06-27T22:20:00.117Z');
        getConversionStub = sandbox.stub(subject.exchangeService, 'conversion').resolves(123);
    });

    describe('getCurrency', () => {
        it('Deve retornar a conversão', async () => {
            const sendSpy = sandbox.spy();
            const nextSpy = sandbox.spy();
            const request = {
                query: {
                    from: 'USD',
                    to: 'EUR',
                    amount: 3
                }
            };

            const response = {
                send: sendSpy
            };

            await subject.getCurrency(request, response, nextSpy);

            expect(nextSpy).to.be.called;
            expect(sendSpy).to.be.called;
            expect(sendSpy).to.be.calledWith(200, sandbox.match({ amount: 123, currency: 'EUR', update_time: '2021-06-27T22:20:00.117Z' }));
            expect(getConversionStub).to.be.called;
            expect(getUpdateTimeStub).to.be.called;
        });



        it('Deve retornar erro 400 ao faltar dados no request', async () => {
            const sendSpy = sandbox.spy();
            const nextSpy = sandbox.spy();
            const request = {
                query: {
                    from: 'USD',
                    amount: 3
                }
            };

            const response = {
                send: sendSpy
            };

            await subject.getCurrency(request, response, nextSpy);

            expect(nextSpy).to.be.called;
            expect(sendSpy).to.be.called;
            expect(sendSpy).to.be.calledWith(400, sandbox.match({ mensagem: 'Parâmetros obrigatórios não enviados' }));
            expect(getConversionStub).to.be.not.called;
            expect(getUpdateTimeStub).to.be.not.called;
        });

        it('Deve retornar erro 500 quando ocorrer erro genérico', async () => {
            getConversionStub.restore();

            getConversionStub = sandbox.stub(subject.exchangeService, 'conversion').rejects(123);

            const sendSpy = sandbox.spy();
            const nextSpy = sandbox.spy();
            const request = {
                query: {
                    from: 'USD',
                    to: 'EUR',
                    amount: 3
                }
            };

            const response = {
                send: sendSpy
            };

            await subject.getCurrency(request, response, nextSpy);

            expect(nextSpy).to.be.called;
            expect(sendSpy).to.be.called;
            expect(sendSpy).to.be.calledWith(500, sandbox.match({ mensagem: 'Ocorreu um erro ao executar a conversão.' }));
            expect(getConversionStub).to.be.called;
            expect(getUpdateTimeStub).to.be.called;
        });
    });
});