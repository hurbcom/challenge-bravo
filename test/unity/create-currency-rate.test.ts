import {
  CreateCurrencyRate,
  GetCurrencyRateByCode,
} from '@/application/use-case/';
import { CurrencyRateRepositoryFake } from '@/infra/repository/';

describe('create-currency-rate', () => {
  it('should create a currency', async () => {
    const currencyRateRepository = new CurrencyRateRepositoryFake();
    const createCurrency = new CreateCurrencyRate(currencyRateRepository);
    const createCurrencyInput = {
      name: 'Grand Theft Auto Dollar',
      symbol: 'GTA$',
      code: 'GTA',
      decimalPoints: 2,
      baseAmount: 1250000.0,
      equivalentCurrencyCode: 'BRL',
      equivalentCurrencyAmount: 83.5,
    };
    await createCurrency.execute(createCurrencyInput);
    const getCurrencyRateByCode = new GetCurrencyRateByCode(
      currencyRateRepository
    );
    const getCurrencyOutput = await getCurrencyRateByCode.execute(
      createCurrencyInput.code
    );
    expect(getCurrencyOutput.name).toBe(createCurrencyInput.name);
    expect(getCurrencyOutput.symbol).toBe(createCurrencyInput.symbol);
    expect(getCurrencyOutput.code).toBe(createCurrencyInput.code);
    expect(getCurrencyOutput.decimalPoints).toBe(
      createCurrencyInput.decimalPoints
    );
    expect(getCurrencyOutput.rate).toBe(77844.31137724551);
  });

  it('should not create a currency with duplicated code', async () => {
    const currencyRateRepository = new CurrencyRateRepositoryFake();
    const createCurrency = new CreateCurrencyRate(currencyRateRepository);
    const createCurrencyInput = {
      name: 'Any Currency',
      code: 'ANY',
      symbol: 'A$',
      decimalPoints: 2,
      baseAmount: 1.0,
      equivalentCurrencyCode: 'USD',
      equivalentCurrencyAmount: 1.0,
    };
    await createCurrency.execute(createCurrencyInput);
    await expect(createCurrency.execute(createCurrencyInput)).rejects.toThrow(
      'Currency rate with code ANY already exists'
    );
  });
});
