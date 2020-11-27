import express from 'express';
import request from 'supertest';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import server from '../../../src/api/server';
import CurrencyService from '../../../src/services/currency.service';

chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;

describe('Currency Routes', () => {
    let app;
    let getAllStub;

    before(async () => {
        app = server.start({ expressApp: express() });
        
        getAllStub = sinon.stub(CurrencyService.prototype, 'getAll');
    });
    

    describe('GET /api/currency', async () => {
        it('should respond with status 200 and an array of currencies in the body', async () => {

            const currencies = [
                'USD',
                'BRL',
                'EUR',
                'BTC',
                'ETH'
            ];

            getAllStub.returns(Promise.resolve(currencies));
            
            const response = await request(app).get('/api/currency');

            assert(getAllStub.calledOnce, true);
            expect(response.body).to.eql(currencies);
        });
    });
});
