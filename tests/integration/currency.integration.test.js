const faker = require('faker');
const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../util/setupTestDB');
const { Currency } = require('../../src/app/models');
const { currencyUSD, currencyEUR, currencyDoge, insertCurrencies } = require('../fixture/currency.fixture');

setupTestDB();

describe('Currency routes', () => {
  describe('POST /v1/currencies', () => {
    let newCurrency;

    beforeEach(() => {
      newCurrency = {
        name: faker.name.lastName(),
        symbol: faker.name.lastName().substr(0, 3).toUpperCase(),
        rate: 0.2354,
      };
    });

    test('should return 201 and successfully create new currency if data is ok', async () => {
      const res = await request(app).post('/v1/currencies').send(newCurrency).expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        name: newCurrency.name,
        symbol: newCurrency.symbol,
        rate: newCurrency.rate,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbCurrency = await Currency.findByPk(res.body.id);
      expect(dbCurrency).toBeDefined();
    });

    test('should return 422 error if symbol is invalid', async () => {
      newCurrency.symbol = 'Brazil';

      await request(app).post('/v1/currencies').send(newCurrency).expect(httpStatus.UNPROCESSABLE_ENTITY);
    });

    test('should return error 422 if the symbol is already used in any currency', async () => {
      await insertCurrencies([currencyEUR]);

      await request(app).post('/v1/currencies').send(currencyEUR).expect(httpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe('GET /v1/currencies', () => {
    test('must return 200 and all existing currencies', async () => {
      await insertCurrencies([currencyEUR, currencyDoge]);
      const res = await request(app).get('/v1/currencies').send().expect(httpStatus.OK);

      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('symbol');
      expect(res.body[0]).toHaveProperty('rate');
    });
  });
  describe('DELETE /v1/currencies/:id', () => {
    test('should return 204 if data is ok', async () => {
      await insertCurrencies([currencyEUR, currencyDoge]);
      await request(app).delete(`/v1/currencies/${currencyEUR.id}`).send().expect(httpStatus.NO_CONTENT);

      const dbCurrency = await Currency.findByPk(currencyEUR.id);
      expect(dbCurrency).toBeNull();
    });
  });
  describe('GET /v1/currencies/convert/:from/:to/:amount', () => {
    test('should return the conversion correctly', async () => {
      await insertCurrencies([currencyUSD, currencyEUR, currencyDoge]);

      const res = await request(app)
        .get(`/v1/currencies/convert/${currencyEUR.symbol}/${currencyDoge.symbol}/240`)
        .send()
        .expect(httpStatus.OK);
      expect(res.body.result).toEqual('847.35');
    });
  });
});
