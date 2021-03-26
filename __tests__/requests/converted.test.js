const request = require('supertest');
const express = require('express');
require('dotenv').config();
const db = require('../../src/db/database');
const cacheClient = require('../../src/db/cache');
const coinExchangeService = require('../../src/service/coinExchangeService');

const routes = require('../../src/routes');

const app = express();

app.use(express.json());
app.use(routes);

describe('/exchanges', () => {
    beforeAll(async () =>  {
        await db.dbConnect('api', 'test');
    });
    afterEach(async () => {
        await db.dbClear();
        // await cacheClient.flushallAsync();
    });
    afterAll(async () => {
        await db.dbClose(true);
        cacheClient.close(true);
    });

    it('Deve criar uma nova taxa cambial quando os parametros forem validos', async () => {
        const res = await request(app)
            .post('/exchanges')
            .send(validCurrencyExchangeParams)
            .set('Accept', 'application/json');

        expect(res.statusCode).toEqual(200);
    });

    it('Deve retornar uma taxa cambial quando os parametros forem validos', async () => {
        await coinExchangeService.create(validCurrencyExchangeParams);

        const res = await request(app)
            .get('/exchanges/USD')
            .send(validCurrencyExchangeParams)
            .set('Accept', 'application/json');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('baseSymbol');
    });

    it('Deve retornar o valor convertido para nova moeda quando os parametros forem validos', async () => {
        await coinExchangeService.create(validCurrencyExchangeParams);

        const res = await request(app)
            .get('/exchanges/convert')
            .query({
                from: 'USD',
                to: 'BRL',
                amount: 123.45
            })
            .set('Accept', 'application/json');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('amount');
        expect(res.body.amount).toEqual("665.3955");
    });


    it('Deve retornar o valor zero quando os parametros forem inválidos', async () => {
        await coinExchangeService.create(validCurrencyExchangeParams);

        const res = await request(app)
            .get('/exchanges/convert')
            .query({
                from: 'FOO',
                to: 'BRL',
                amount: 123.45
            })
            .set('Accept', 'application/json');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('amount');
        expect(res.body.amount).toEqual("0.00");
    });

    it('Deve remover uma taxa cambial', async () => {
        await coinExchangeService.create(validCurrencyExchangeParams);

        const res = await request(app)
            .delete('/exchanges/USD')
            .send(validCurrencyExchangeParams)
            .set('Accept', 'application/json');

        const currencyExchange = await coinExchangeService.findByBaseSymbol('USD');

        expect(res.statusCode).toEqual(200);

        expect(currencyExchange).toBeNull();
    });
});

const validCurrencyExchangeParams = {
    baseSymbol: 'USD',
    rates: [
        { to: 'BRL', rate: 5.39 },
        { to: 'EUR', rate: 0.8299 },
        { to: 'BTC', rate: 0.00002851 },
        { to: 'ETH', rate: 0.000837 },
    ],
    createdAt: '2021-01-19T14:18:26.359Z'
}
