import { Currency } from '../entities/currency.entity';
import { CurrencyService } from './currency.service';

const mockCurrencyDatabase = [
  {
    id: '123',
    code: 'HURB',
    backingCurrency: 'USD',
    unitCost: '2'
  },
  {
    id: '321',
    code: 'BENIN',
    backingCurrency: 'USD',
    unitCost: '1'
  }
];

const MockRepository = () => ({
  findByCurrencyCode: jest
    .fn()
    .mockImplementation((code: string)=> {
      const result = mockCurrencyDatabase.find((currency)=> currency.code === code);
      if(!result) return Promise.resolve(null);
      return Promise.resolve(new Currency(result.code,result.unitCost,result.backingCurrency,result.id));
    }),
  create: jest
    .fn()
    .mockImplementation((currency: Currency) => Promise.resolve(currency)),
});

const MockAPI = () => ({
  convert: jest.fn().mockImplementation((from, to, amount)=> Promise.resolve(String(amount * 10)))
});

describe('Currency service unit tests', () => {
  const currencyService = new CurrencyService(MockRepository(), MockAPI());
  it('should create currency', async () => {
    const input = {
      code: 'HURB',
      unitCost: '100'
    };

    const currency = await currencyService.createCurrency(input);

    expect(currency.backingCurrency).toBe('USD');
    expect(currency.unitCost).toBe(input.unitCost);
    expect(currency.code).toBe(input.code);
  });

  it('should convert customs currencies', async () => {
    const result = await currencyService.convertCurrency('BENIN','HURB','10');
    expect(result).toBe('5');
  });

  it('should convert real currencies', async () => {
    const result = await currencyService.convertCurrency('USD','BRL','10');
    expect(result).toBe('100');
  });
});
