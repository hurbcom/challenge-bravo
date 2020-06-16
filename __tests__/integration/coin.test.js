const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json())
app.use(routes);

describe('Coin', () => {
    it('SHOUD BE ABLE TO REGISTER', async () => {
        const response = await request(app)
            .post('/coins')
            .send({
                code: 'TEST',
                name: 'Moeda de teste',
                lastro: 171
            })
        expect(response.body).toHaveProperty('code');
    })
    it('should show error if i try to register an existing currency', async () => {
        const response = await request(app)
            .post('/coins')
            .send({
                code: 'USD',
                name: 'Dólar Comercial',
                lastro: 5.1559
            })
        expect(response.body).toHaveProperty('erro');
    })
})

