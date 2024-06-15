import {
  CreateCurrencyRate,
  DeleteCurrencyRateByCode,
  GetCurrencyRateByCode,
} from '@/application/use-case/';
import { CurrencyRateRepositoryFake } from '@/infra/repository/';

describe('delete-currency-rate', () => {
  it('should delete a currency rate by code', async () => {
    const currencyRateRepository = new CurrencyRateRepositoryFake();
    const createCurrency = new CreateCurrencyRate(currencyRateRepository);
    const createCurrencyInput = {
      name: 'Any Currency',
      symbol: 'AC$',
      code: 'AYC',
      decimalDigits: 2,
      baseAmount: 1.0,
      equivalentCurrencyCode: 'USD',
      equivalentCurrencyAmount: 1.0,
    };
    await createCurrency.execute(createCurrencyInput);
    const deleteCurrencyRate = new DeleteCurrencyRateByCode(
      currencyRateRepository
    );
    await deleteCurrencyRate.execute(createCurrencyInput.code);
    const getCurrencyRateByCode = new GetCurrencyRateByCode(
      currencyRateRepository
    );
    await expect(
      getCurrencyRateByCode.execute(createCurrencyInput.code)
    ).rejects.toThrow('Currency not found');
  });

  it('should throw an error when trying to delete a currency rate that does not exist', async () => {
    const currencyRateRepository = new CurrencyRateRepositoryFake();
    const deleteCurrencyRate = new DeleteCurrencyRateByCode(
      currencyRateRepository
    );
    await expect(deleteCurrencyRate.execute('ABC')).rejects.toThrow(
      'Currency not found'
    );
  });

  it('should throw an error when trying to delete USD currency rate', async () => {
    const currencyRateRepository = new CurrencyRateRepositoryFake();
    const deleteCurrencyRate = new DeleteCurrencyRateByCode(
      currencyRateRepository
    );
    await expect(deleteCurrencyRate.execute('USD')).rejects.toThrow(
      'Cannot delete USD currency rate'
    );
  });
});
