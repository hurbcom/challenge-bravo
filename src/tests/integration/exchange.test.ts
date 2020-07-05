import app from "@core/application";
import request from "supertest";
import sequelize from "@config/database";
import { MockGetExchangeRateFromUSDToBTC, MockGetSymbolsRequest } from "@tests/mocks/CoinAPIMock";
import CurrencyFactory from '@factories/CurrencyFactory';
import { wipe } from "@utils/cache";

describe('exchange integration test suite', () => {

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await wipe();
  });

  it('should calculate the exchange rate between two given currencies', async () => {
    MockGetSymbolsRequest();
    MockGetExchangeRateFromUSDToBTC();

    await CurrencyFactory.create('Currency', { name: "United State Dollars", symbol: "USD" });
    await CurrencyFactory.create('Currency', { name: "Bitcoin", symbol: "BTC" });

    const response = await request(app.router)
      .get('/exchange?from=USD&to=BTC&amount=100');

    const exchangeRate = parseFloat(0.0001103742210505531519737212.toFixed(20));

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ from: 'USD', to: 'BTC', exchangeRate, total: exchangeRate * 100 });
  });

});