import { ConvertCurrency } from '@/application/use-case';
import { CurrencyRateRepositoryFake } from '@/infra/repository/';

describe('Currency Converter', () => {
  let currencyRateRepository: CurrencyRateRepositoryFake;
  let convertCurrency: ConvertCurrency;

  beforeEach(() => {
    currencyRateRepository = new CurrencyRateRepositoryFake();
    convertCurrency = new ConvertCurrency(currencyRateRepository);
  });

  it('should convert USD to BRL', async () => {
    const input = {
      from: 'USD',
      to: 'BRL',
      amount: 1,
    };
    const result = await convertCurrency.execute(input);
    expect(result.value).toBe(5.2);
  });

  it('should convert BRL to USD', async () => {
    const input = {
      from: 'BRL',
      to: 'USD',
      amount: 5.2,
    };
    const result = await convertCurrency.execute(input);
    expect(result.value).toBe(1.0);
  });

  it('should convert USD to EUR', async () => {
    const input = {
      from: 'USD',
      to: 'EUR',
      amount: 1,
    };
    const result = await convertCurrency.execute(input);
    expect(result.value).toBe(0.92);
  });

  it('should convert EUR to BRL', async () => {
    const input = {
      from: 'EUR',
      to: 'BRL',
      amount: 1,
    };
    const result = await convertCurrency.execute(input);
    expect(result.value).toBe(5.65);
  });

  it('should throw an error when the currency is not found', async () => {
    const input = {
      from: 'INVALID',
      to: 'BRL',
      amount: 1,
    };
    await expect(convertCurrency.execute(input)).rejects.toThrow(
      'Currency rate not found'
    );
  });

  it('should throw an error when the amount is invalid', async () => {
    const input = {
      from: 'USD',
      to: 'BRL',
      amount: -1,
    };
    await expect(convertCurrency.execute(input)).rejects.toThrow(
      'Invalid amount'
    );
  });
});
