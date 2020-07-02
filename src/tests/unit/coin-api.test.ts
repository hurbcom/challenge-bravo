import "reflect-metadata";
import CoinAPIService from "@services/CoinAPIService";
import providers from "@core/providers";

describe('exchange unit test suite', () => {

  it('should calculate exchange between two values', () => {

    const ExchangeServiceContainer = providers.container.resolve(CoinAPIService);

    const result = ExchangeServiceContainer.calculateExchange(5, 1, 100);

    expect(result).toBe(20);
  });

  it('should throw an error when negative numbers are used to calculate exchange between values', () => {
    const ExchangeServiceContainer = providers.container.resolve(CoinAPIService);

    expect(() => ExchangeServiceContainer.calculateExchange(-1, -5, 100)).toThrowError();
    expect(() => ExchangeServiceContainer.calculateExchange(1, -5, -100)).toThrowError();
    expect(() => ExchangeServiceContainer.calculateExchange(1, -5, 100)).toThrowError();
  });

});