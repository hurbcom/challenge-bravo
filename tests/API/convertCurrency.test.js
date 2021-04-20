const request = require("supertest");
const app = require('../../app');
const Currency = require('../../src/models/Currency');

beforeEach(async () => {
    const currencies = [
        {currency: 'USD', usd_value: 1},
        {currency: 'BRL', usd_value: 5.59},
        {currency: 'EUR', usd_value: 0.83},
        {currency: 'BTC', usd_value: 0.000016},
        {currency: 'ETH', usd_value: 0.00041},
    ];
    await Currency.deleteMany({});
    await Currency.insertMany(currencies);
});

test('API - convert currency right params', async () => {
    const response = await request(app).get("/currencies?from=BRL&to=USD&amount=10");
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({total: 1.78});
});

test('API - convert currency wrong params', async () => {
    const response = await request(app).get("/currencies?from=NOT_EXISTS&to=USD&amount=NOT_NUMERIC");
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(2);
});