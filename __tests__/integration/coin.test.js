const request = require('supertest');
const express = require('express');

const faker = require('faker');

const routes = require('../../src/routes');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json())
app.use(routes);

const Coin = {
    code: faker.random.word(),
    name: faker.name.findName(),
    lastro: faker.random.number(),
}

describe('Coin', () => {
    it('shoud be able to register', async () => {
        const response = await request(app)
            .post('/coins')
            .send(Coin)
        expect(response.body).toHaveProperty('code');
    })
    it('should not to be able to register with duplicated coin code', async () => {
        const response = await request(app)
            .post('/coins')
            .send(Coin)
        expect(response.status).toBe(400);
    })

    it('should be able to update a coin', async () => {
        const responseUpdate = await request(app)
            .put(`/coins/1`)
            .send({
                code: 'USDTUP',
                name: 'Dólar de teste',
                lastro: 6.0
            })
        expect(responseUpdate.body.code).toEqual('USDTUP');
    })

    it('should not to be able to update with wrong id coin ', async () => {
        const response = await request(app)
            .put('/coins/5')
            .send({
                code: 'USDTUP',
                name: 'Dólar de teste',
                lastro: 6.0
            })
        expect(response.status).toBe(400);
    })

    it('should not to be able to update with wrong json key data coin ', async () => {
        const response = await request(app)
            .put('/coins/1')
            .send({
                codes: 'USDTUP',
                name: 'Dólar de teste',
                lastro: 6.0
            })
        expect(response.status).toBe(400);
    })

})

