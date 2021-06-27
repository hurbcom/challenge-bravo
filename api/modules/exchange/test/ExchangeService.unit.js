const { expect } = require('chai');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const ExchangeService = require('../services/ExchangeService');

before(() => chai.use(sinonChai));


describe('Exchange Service', () => {

    let sandbox;
    let subject;
    let getUpdateTimeStub;
    let getCurrencyStub;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        subject = new ExchangeService();
        getUpdateTimeStub = sandbox.stub(subject.coinRepository, 'getUpdateTime').resolves('2021-06-27T22:20:00.117Z');
        getCurrencyStub = sandbox.stub(subject.coinRepository, 'getCurrency').resolves(0.8);
    });

    describe('isMainCoin', () => {
        it('Deve retornar true quando for USD', () => {
            const ehDolar = subject.isMainCoin('USD');
            expect(ehDolar).to.be.ok;
        });

        it('Deve retornar false quando for EUR', () => {
            const ehDolar = subject.isMainCoin('EUR');
            expect(ehDolar).to.be.not.ok;
        });
    });

    describe('checkUpdateTime', () => {
        it('Se tiver update time no cache deve retorná-lo', async () => {
            const update_time = await subject.checkUpdateTime();

            expect(update_time).to.be.equal('2021-06-27T22:20:00.117Z');
        });

        it('Deve retornar false quando for EUR', async () => {
            getUpdateTimeStub.restore();
            getUpdateTimeStub = sandbox.stub(subject.coinRepository, 'getUpdateTime').resolves(undefined);
           
            try{
                await subject.checkUpdateTime();
            } catch(e){
                expect(e.message).to.be.equals('Moedas estão atualizando...');
            }
        });
    });

    describe('conversion', () => {
        it('Se não tiver conversão deve retornar amount', async () => {
            const conversionResult = await subject.conversion('USD', 'USD', 3);

            expect(conversionResult).to.be.equal(3);
        });

        it('Se for conversão de dolar para outra moeda', async () => {
            const conversionResult = await subject.conversion('USD', 'EUR', 3);

            expect(conversionResult).to.be.equal(3.75);
        });

        it('Se for conversão outra moeda para dólar', async () => {
            const conversionResult = await subject.conversion( 'EUR', 'USD', 2);

            expect(conversionResult).to.be.equal(1.6);
        });

        it('Se for conversão outra moeda para outra moeda', async () => {
            getCurrencyStub.restore();
            getCurrencyStub = sandbox.stub(subject.coinRepository, 'getCurrency');

            getCurrencyStub.onFirstCall().resolves(3);
            getCurrencyStub.onSecondCall().resolves(4);
            
            const conversionResult = await subject.conversion('EUR', 'BTC', 2);
            

            expect(conversionResult).to.be.equal(24);
        });
    });
});