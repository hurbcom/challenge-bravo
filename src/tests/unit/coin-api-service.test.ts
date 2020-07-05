import "reflect-metadata";
import CoinAPIService from "@services/CoinAPIService";
import providers from "@core/providers";
import types from "@core/types";

describe('exchange unit test suite', () => {

  it('should calculate exchange between two values', () => {

    const ExchangeServiceContainer = providers.container.get<CoinAPIService>(types.ExchangeService);

    const result = ExchangeServiceContainer.calculateExchange(5, 100);

    expect(result).toBe(500);
  });

  it('should throw an error when negative numbers are used to calculate exchange between values', () => {
    const ExchangeServiceContainer = providers.container.get<CoinAPIService>(types.ExchangeService);

    expect(() => ExchangeServiceContainer.calculateExchange(-1, -5)).toThrowError();
    expect(() => ExchangeServiceContainer.calculateExchange(1, -5,)).toThrowError();
    expect(() => ExchangeServiceContainer.calculateExchange(-1, 5,)).toThrowError();
  });

});