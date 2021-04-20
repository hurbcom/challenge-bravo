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

test('API - remove currency right params', async () => {
    const response = await request(app).delete("/currencies/BRL");
    expect(response.statusCode).toBe(200);
});

test('API - remove currency wrong params', async () => {
    const response = await request(app).delete("/currencies/CAD");
    expect(response.statusCode).toBe(400);
});