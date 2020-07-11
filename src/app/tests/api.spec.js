require('dotenv').config();
const request = require('supertest');
const axios = require('axios');

const app = require('../app');

jest.mock("axios");

describe('API Tests', () => {
    beforeAll(() => {
        axios.get.mockImplementation(() => Promise.resolve({
            status: 200, data: {
                conversion_rates: {
                    "USD": 1,
                    "AED": 3.6720,
                    "BRL": 5.3605,
                    "EUR": 0.8856
                }
            }
        }));
    });

    test('when list currencies request should return ok', async () => {
        const response = await request(app).get('/currencies');
        expect(response.statusCode).toBe(200);
        expect(response.body.result).toEqual(true);
        expect(response.body.message).toEqual('System currencies available list');
        expect(response.body.data).toHaveLength(3);
    });

    test('when add currency request should return ok', async () => {
        const response = await request(app).post('/currencies')
            .send({
                currency: "AED"
            })
        expect(response.statusCode).toBe(201);
        expect(response.body.result).toEqual(true);
        expect(response.body.message).toEqual('Currency added');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('currencyCode');

        const getResponse = await request(app).get('/currencies');
        expect(getResponse.body.data).toHaveLength(4);
    });

    test('when delete currency request should return ok', async () => {
        const response = await request(app).delete('/currencies/AED')
        expect(response.statusCode).toBe(200);
        expect(response.body.result).toEqual(true);
        expect(response.body.message).toEqual('Currency deleted');

        const getResponse = await request(app).get('/currencies');
        expect(getResponse.body.data).toHaveLength(3);
    });

    test('when get currency conversion should return ok', async done => {
        const response = await request(app).get('/currencies/conversion?from=BRL&to=EUR&amount=100')
        expect(response.statusCode).toBe(200);
        expect(response.body.result).toEqual(true);
        expect(response.body.message).toEqual('Conversion executed');
        expect(response.body.data.from_currency).toEqual('BRL');
        expect(response.body.data.from_amount).toEqual('100');
        expect(response.body.data.to_currency).toEqual('EUR');
        expect(response.body.data.to_amount).toEqual('16.5208');
        done()
    });

});
