const ExchangeService = require('../../../src/app//exchange/service');
const { BRL, USD, EUR } = require('../../../src/app/common');

describe('ExchangeService tests', () => {

  let service;

  beforeEach(() => {
    service = new ExchangeService();
  })

  describe('when method calculate is called', () => {
    test('convert BRL to USD', () => {
      const result = service.calculate(BRL, USD, 100);

      expect(result).toBe(18.083182640144663);
    })

    test('convert USD to EUR', () => {
      const result = service.calculate(USD, EUR, 100);

      expect(result).toBe(85);
    })

    test('convert USD to USD', () => {
      const result = service.calculate(USD, USD, 100);

      expect(result).toBe(100);
    })

    test('with non know currency', () => {
      const result = service.calculate(USD, 'asd', 100);

      expect(result).toEqual('Currencies not found');
    })
  })
})