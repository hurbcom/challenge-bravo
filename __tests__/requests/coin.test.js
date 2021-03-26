const request = require('supertest');
const express = require('express');
require('dotenv').config();
const db = require('../../src/db/database');
const cacheClient = require('../../src/db/cache');
const CoinService = require('../../src/service/coinService');

const routes = require('../../src/routes');

const app = express();

app.use(express.json());
app.use(routes);

describe('/currencies', () => {
    beforeAll(async () =>  {
        await db.dbConnect('api', 'test');
    });

    afterEach(async () => {
        await db.dbClear();
    });

    afterAll(async () => {
        await db.dbClose(true);
        cacheClient.close(true);
    });

    it('Deve criar uma nova moeda quando os parametros forem válidos', async () => {
        const res = await request(app)
            .post('/coins')
            .send(validCurrencyParams)
            .set('Accept', 'application/json');

        expect(res.statusCode).toEqual(200);
    });

    it('Deve retornar uma moeda quando os parametros forem válidos', async () => {
        await CoinService.create(validCurrencyParams);

        const res = await request(app)
            .get('/coins/BRL')
            .send(validCurrencyParams)
            .set('Accept', 'application/json');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('to');
    });

    it('Deve remover uma moeda', async () => {
        await CoinService.create(validCurrencyParams);

        const res = await request(app)
            .delete('/coins/BRL')
            .send(validCurrencyParams)
            .set('Accept', 'application/json');

        const currencyExchange = await CoinService.findBySymbol('BRL');

        expect(res.statusCode).toEqual(200);

        expect(currencyExchange).toBeNull();
    });
});

const validCurrencyParams = {
    to: 'BRL',
    label: 'Brazilian Real'
}