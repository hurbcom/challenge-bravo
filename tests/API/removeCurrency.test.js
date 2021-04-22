const request = require("supertest");
const app = require('../../app');
const Currency = require('../../src/models/Currency');
const User = require('../../src/models/User');
const crypto = require('crypto');
let userToken;

beforeAll(async () => {
    // Criando usuário de teste e obtendo token
    const salt = process.env.HASH_SALT || 'secret';
    const hashedPassword = crypto.createHmac('sha256', salt).update('secret').digest('hex');

    await User.create({username: 'admin', password: hashedPassword});
    const response = await request(app).post("/login").send({username: 'admin', password: 'secret'});
    userToken = response.body.token;
});

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
    const response = await request(app).delete("/currencies/BRL").set('Authorization', `Bearer ${userToken}`);
    expect(response.statusCode).toBe(200);
});

test('API - remove currency wrong params', async () => {
    const response1 = await request(app).delete("/currencies/CAD").set('Authorization', `Bearer ${userToken}`);
    expect(response1.statusCode).toBe(400);

    // Token inválido
    const response2 = await request(app).delete("/currencies/CAD").set('Authorization', 'INVALID_TOKEN');
    expect(response2.statusCode).toBe(401);
    expect(response2.body.message).toEqual('Token Inválido!');
});