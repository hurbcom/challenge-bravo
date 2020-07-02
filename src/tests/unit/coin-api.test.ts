import CoinAPIService from "@services/CoinAPIService";
import sequelize from "@config/database";

describe('exchange unit test suite', () => {

  it('should calculate exchange between two values', () => {
    const result = new CoinAPIService().calculateExchange(5, 1, 100);

    expect(result).toBe(20);
  });

  it('should throw an error when negative numbers are used to calculate exchange between values', () => {
    const ExchangeServiceContainer = new CoinAPIService();

    expect(() => ExchangeServiceContainer.calculateExchange(-1, -5, 100)).toThrowError();
    expect(() => ExchangeServiceContainer.calculateExchange(1, -5, -100)).toThrowError();
    expect(() => ExchangeServiceContainer.calculateExchange(1, -5, 100)).toThrowError();
  });

});