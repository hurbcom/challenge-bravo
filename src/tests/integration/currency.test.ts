import app from "@core/application";
import request from 'supertest';
import CurrencyFactory from '@factories/CurrencyFactory';
import sequelize from "@config/database";

describe('currency integration test suite', () => {

  beforeEach(async () => await sequelize.sync({ force: true }));

  it('should find all currencies', async () => {
    await CurrencyFactory.createMany('Currency', 3);

    const response = await request(app.router)
      .get('/currency');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
  });

  it('should find a specific currency by its id', async () => {
    const currencies: any = await CurrencyFactory.createMany('Currency', 10);

    const randomCurrencyIndex = Math.floor(Math.random() * currencies.length - 1);
    const randomCurrency = currencies[randomCurrencyIndex];

    const response = await request(app.router)
      .get(`/currency/${randomCurrency.id}`);

    expect(response.status).toBe(200);
    expect({
      id: response.body.id,
      name: response.body.name,
      symbol: response.body.symbol,
    }).toMatchObject({
      id: randomCurrency.id,
      name: randomCurrency.name,
      symbol: randomCurrency.symbol
    });
  });

  it('should find a specific currency by its symbol', async () => {
    const currencies: any = await CurrencyFactory.createMany('Currency', 10);

    const randomCurrencyIndex = Math.floor(Math.random() * (currencies.length - 1));
    const randomCurrency = currencies[randomCurrencyIndex];

    const response = await request(app.router)
      .get(encodeURI(`/currency/symbol/${randomCurrency.symbol}`));

    expect(response.status).toBe(200);
    expect({
      id: response.body.id,
      name: response.body.name,
      symbol: response.body.symbol,
    }).toMatchObject({
      id: randomCurrency.id,
      name: randomCurrency.name,
      symbol: randomCurrency.symbol
    });
  });

});