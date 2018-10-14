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
  const amountParam = 23.90;

  describe('# Status Code', () => {
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

  describe('# Body', () => {
    describe('- Amount', () => {
      it('Should response contains amount', async (done) => {
        const { body } = await request(app)
          .get('/currency-conversion')
          .query({ from: fromParam, to: toParam, amount: amountParam });
        expect(body).toHaveProperty('amount');
        done();
      });
      it('Should response contains a valid amount', async (done) => {
        const { body } = await request(app)
          .get('/currency-conversion')
          .query({ from: fromParam, to: toParam, amount: amountParam });
        const { amount } = body;
        expect(amount).toBe(amountParam);
        done();
      });
    });

    describe('- Base', () => {
      it('Should response contains base', async (done) => {
        const { body } = await request(app)
          .get('/currency-conversion')
          .query({ from: fromParam, to: toParam, amount: amountParam });
        expect(body).toHaveProperty('base');
        done();
      });
      it('Should response contains a valid base', async (done) => {
        const { body } = await request(app)
          .get('/currency-conversion')
          .query({ from: fromParam, to: toParam, amount: amountParam });
        const { base } = body;
        expect(base).toBe(fromParam);
        done();
      });
    });

    describe('- Date', () => {
      it('Should response contains date', async (done) => {
        const { body } = await request(app)
          .get('/currency-conversion')
          .query({ from: fromParam, to: toParam, amount: amountParam });
        expect(body).toHaveProperty('date');
        done();
      });
      it('Should response contains a valid date', async (done) => {
        const { body } = await request(app)
          .get('/currency-conversion')
          .query({ from: fromParam, to: toParam, amount: amountParam });
        const { date } = body;
        const dateTest = new Date();
        const yearTest = dateTest.getFullYear();
        const monthAux = dateTest.getMonth() + 1;
        const monthTest = monthAux >= 10 ? monthAux : `0${monthAux}`;
        const dayAux = dateTest.getDate();
        const dayTest = dayAux >= 10 ? dayAux : `0${dayAux}`;
        expect(date).toBe(`${yearTest}-${monthTest}-${dayTest}`);
        done();
      });
    });

    describe('- Rates', () => {
      it('Should response contains rates', async (done) => {
        const { body } = await request(app)
          .get('/currency-conversion')
          .query({ from: fromParam, to: toParam, amount: amountParam });
        expect(body).toHaveProperty('rates');
        done();
      });
      it('Should response contains one rate when I send a simple to', async (done) => {
        const { body } = await request(app)
          .get('/currency-conversion')
          .query({ from: fromParam, to: toParam, amount: amountParam });
        const { rates } = body;
        const totRates = Object.keys(rates);
        expect(totRates).toHaveLength(1);
        done();
      });
      it('Should response contains five rate when I send five to params', async (done) => {
        const { body } = await request(app)
          .get('/currency-conversion')
          .query({ from: fromParam, to: toCompoundParam, amount: amountParam });
        const { rates } = body;
        const totRates = Object.keys(rates);
        expect(totRates).toHaveLength(5);
        done();
      });
      it('Should response contains the same rate code as to param', async (done) => {
        const { body } = await request(app)
          .get('/currency-conversion')
          .query({ from: fromParam, to: toParam, amount: amountParam });
        const { rates } = body;
        expect(rates).toHaveProperty(toParam);
        done();
      });
      it('Should response contains the correct rate value', async (done) => {
        const { body } = await request(app)
          .get('/currency-conversion')
          .query({ from: fromParam, to: toParam, amount: amountParam });
        const { rates } = body;
        const value = rates[toParam];
        expect(value).toBe(3.84);
        done();
      });
    });

    describe('- Converted', () => {
      it('Should response contains converted', async (done) => {
        const { body } = await request(app)
          .get('/currency-conversion')
          .query({ from: fromParam, to: toParam, amount: amountParam });
        expect(body).toHaveProperty('converted');
        done();
      });
      it('Should response contains one converted when I send a simple to', async (done) => {
        const { body } = await request(app)
          .get('/currency-conversion')
          .query({ from: fromParam, to: toParam, amount: amountParam });
        const { converted } = body;
        const totConverted = Object.keys(converted);
        expect(totConverted).toHaveLength(1);
        done();
      });
      it('Should response contains five converted when I send five to params', async (done) => {
        const { body } = await request(app)
          .get('/currency-conversion')
          .query({ from: fromParam, to: toCompoundParam, amount: amountParam });
        const { converted } = body;
        const totConverted = Object.keys(converted);
        expect(totConverted).toHaveLength(5);
        done();
      });
      it('Should response contains the same converted code as to param', async (done) => {
        const { body } = await request(app)
          .get('/currency-conversion')
          .query({ from: fromParam, to: toParam, amount: amountParam });
        const { converted } = body;
        expect(converted).toHaveProperty(toParam);
        done();
      });
      it('Should response contains the correct converted value', async (done) => {
        const { body } = await request(app)
          .get('/currency-conversion')
          .query({ from: fromParam, to: toParam, amount: amountParam });
        const { converted } = body;
        const value = converted[toParam];
        expect(value).toBe(3.84 * amountParam);
        done();
      });
    });
  });
});
