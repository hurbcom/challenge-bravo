import express from 'express';
import request from 'supertest';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import server from '../../../src/api/server';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Currency Routes', () => {
    let app;

    before(async () => {
        app = server.start({ expressApp: express() });
        
        // getAllStub = sinon.stub(CurrencyService.prototype, 'getAll');
    });
    

    describe('GET /api/currency', async () => {
        it('should respond with status 200 and an array of currencies in the body', async () => {

            const expectedCurrencies = [
                'USD',
                'BRL',
                'EUR',
                'BTC',
                'ETH'
            ];
            
            const response = await request(app).get('/api/currency');

            expect(response.body).to.eql(expectedCurrencies);
        });
    });
});
