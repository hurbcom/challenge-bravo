const request = require('supertest');
const app = require('../../src/app');
const mockCryptoCompare = require('./mocks/cryptocompare');


describe('Currency Conversion', () => {
  beforeEach(() => {
    mockCryptoCompare();
  });

  const fromParam = 'USD';
  const toParam = 'BRL';
  const toCompoundParam = 'USD,BRL,EUR,BTC,ETH';
  const amountParam = '23.9';

  describe('Correct Status Code', () => {
    it('Should response 422 if i don`t send a from', async (done) => {
      const { statusCode } = await request(app)
        .get('/currency-conversion')
        .query({ to: toParam, amount: amountParam });
      expect(statusCode).toBe(422);
      done();
    });
    it('Should response 422 if i don`t send a to', async (done) => {
      const { statusCode } = await request(app)
        .get('/currency-conversion')
        .query({ from: fromParam, amount: amountParam });
      expect(statusCode).toBe(422);
      done();
    });
    it('Should response 422 if i don`t send a amount', async (done) => {
      const { statusCode } = await request(app)
        .get('/currency-conversion')
        .query({ to: toParam, from: fromParam });
      expect(statusCode).toBe(422);
      done();
    });
    it('Should response 400 if i don`t send a valid from', async (done) => {
      const { statusCode } = await request(app)
        .get('/currency-conversion')
        .query({ from: 'ARG', to: toParam, amount: amountParam });
      expect(statusCode).toBe(400);
      done();
    });
    it('Should response 400 if i don`t send a valid to', async (done) => {
      const { statusCode } = await request(app)
        .get('/currency-conversion')
        .query({ from: fromParam, to: 'ARG', amount: amountParam });
      expect(statusCode).toBe(400);
      done();
    });
    it('Should response 400 if i don`t send a valid amount', async (done) => {
      const { statusCode } = await request(app)
        .get('/currency-conversion')
        .query({ from: fromParam, to: toParam, amount: 'ARG' });
      expect(statusCode).toBe(400);
      done();
    });
    it('Should response 200 if i send a valid query params', async (done) => {
      const { statusCode } = await request(app)
        .get('/currency-conversion')
        .query({ from: fromParam, to: toParam, amount: amountParam });
      expect(statusCode).toBe(200);
      done();
    });
    it('Should response 200 if i send a valid query params, including a compound to', async (done) => {
      const { statusCode } = await request(app)
        .get('/currency-conversion')
        .query({ from: fromParam, to: toCompoundParam, amount: amountParam });
      expect(statusCode).toBe(200);
      done();
    });
  });
});
