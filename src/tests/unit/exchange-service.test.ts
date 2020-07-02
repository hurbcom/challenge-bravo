import "reflect-metadata";
import CoinAPIService from "@services/exchange/CoinAPIService";

describe('exchange unit test suite', () => {

  it('should calculate exchange between two values', () => {
    //const ExchangeServiceContainer = providers.container.resolve(CoinAPIService);

    const result = new CoinAPIService().calculateExchange(5, 1, 100);

    expect(result).toBe(20);
  });

  it('should throw an error when negative numbers are used to calculate exchange between values', () => {
    //const ExchangeServiceContainer = providers.container.resolve(CoinAPIService);

    expect(() => new CoinAPIService().calculateExchange(-1, 5, 100)).toThrowError();
    expect(() => new CoinAPIService().calculateExchange(1, 5, -100)).toThrowError();
    expect(() => new CoinAPIService().calculateExchange(1, -5, 100)).toThrowError();
    expect(() => new CoinAPIService().calculateExchange(-1, -5, -100)).toThrowError();
  });

});