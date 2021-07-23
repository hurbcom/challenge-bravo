import 'reflect-metadata';

import { FakeCurrencyConverterProvider } from '@container/providers/CurrencyConverterProvider/fakes/FakeCurrencyConverterProvider';
import { brl } from '@container/providers/CurrencyConverterProvider/fakes/mocks/currencyQuotation.mock';

import { ConvertCurrencyService } from './ConvertCurrencyService';

let fakeCurrencyConverterProvider: FakeCurrencyConverterProvider;

let convertCurrencyService: ConvertCurrencyService;

describe('ConvertCurrencyService', () => {
  beforeEach(() => {
    fakeCurrencyConverterProvider = new FakeCurrencyConverterProvider();

    convertCurrencyService = new ConvertCurrencyService(
      fakeCurrencyConverterProvider,
    );
  });

  it('should be able to convert original currencies', async () => {
    const result = await convertCurrencyService.execute({
      from: 'brl',
      to: 'usd',
      amount: '1',
    });

    expect(result).toBe(brl.usd);
  });
});
