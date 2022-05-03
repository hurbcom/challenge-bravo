const request = require('supertest');
const createServer = require('../../src/app');
const { generateCurrency } = require('../factories/currencies.factories');

exports.seedDatabase = async () => {
    const app = createServer();
    // load currencies
    await request(app)
        .post('/currencies')
        .send(generateCurrency('USD'))
        .set('Accept', 'application/json');
    await request(app)
        .post('/currencies')
        .send(generateCurrency('BRL'))
        .set('Accept', 'application/json');
    await request(app)
        .post('/currencies')
        .send(generateCurrency('BTC'))
        .set('Accept', 'application/json');
    await request(app)
        .post('/currencies')
        .send(generateCurrency('ETH'))
        .set('Accept', 'application/json');
    await request(app)
        .post('/currencies')
        .send(generateCurrency('HURB', 1.7))
        .set('Accept', 'application/json');
    await request(app)
        .post('/currencies')
        .send(generateCurrency('FAKE', 2.55))
        .set('Accept', 'application/json');
};
