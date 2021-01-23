const request = require('supertest');
const express = require('express');
const dbHandler = require('../../db/database_handler');
const cacheClient = require('../../lib/cache_client');
const CurrencyService = require('../../src/services/CurrencyService');

const routes = require('../../routes');

const app = express();

app.use(express.json());
app.use(routes);

describe('/currencies', () => {
    beforeAll(async () =>  {
        await dbHandler.dbConnect('hurb', 'test');
    });

    afterEach(async () => {
        await dbHandler.dbClear();
    });

    afterAll(async () => {
        await dbHandler.dbClose(true);
        cacheClient.close(true);
    });

    it('Deve criar uma nova moeda quando os parametros forem válidos', async () => {
        const res = await request(app)
            .post('/currencies')
            .send(validCurrencyParams)
            .set('Accept', 'application/json');

        expect(res.statusCode).toEqual(200);
    });

    it('Deve retornar uma moeda quando os parametros forem válidos', async () => {
        await CurrencyService.create(validCurrencyParams);

        const res = await request(app)
            .get('/currencies/BRL')
            .send(validCurrencyParams)
            .set('Accept', 'application/json');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('symbol');
    });

    it('Deve remover uma moeda', async () => {
        await CurrencyService.create(validCurrencyParams);

        const res = await request(app)
            .delete('/currencies/BRL')
            .send(validCurrencyParams)
            .set('Accept', 'application/json');

        const currencyExchange = await CurrencyService.findBySymbol('BRL');

        expect(res.statusCode).toEqual(200);

        expect(currencyExchange).toBeNull();
    });
});

const validCurrencyParams = {
    symbol: 'BRL',
    label: 'Brazilian Real'
}