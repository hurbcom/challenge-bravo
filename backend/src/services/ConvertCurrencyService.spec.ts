import 'reflect-metadata';

import { FakeCacheProvider } from '@container/providers/CacheProvider/fakes/FakeCacheProvider';
import { FakeCurrencyConverterProvider } from '@container/providers/CurrencyConverterProvider/fakes/FakeCurrencyConverterProvider';
import * as currencies from '@container/providers/CurrencyConverterProvider/fakes/mocks/currencyQuotation.mock';
import { FakeDateProvider } from '@container/providers/DateProvider/fakes/FakeDateProvider';

import { AppError } from '@errors/AppError';

import { FakeCurrenciesRepository } from '@repositories/fakes/FakeCurrenciesRepository';

import { ConvertCurrencyService } from './ConvertCurrencyService';

let fakeCurrencyConverterProvider: FakeCurrencyConverterProvider;
let fakeCacheProvider: FakeCacheProvider;
let fakeDateProvider: FakeDateProvider;

let fakeCurrenciesRepository: FakeCurrenciesRepository;
let convertCurrencyService: ConvertCurrencyService;

function round(number: number): number {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

describe('ConvertCurrencyService', () => {
  beforeEach(() => {
    fakeCurrenciesRepository = new FakeCurrenciesRepository();

    fakeCurrencyConverterProvider = new FakeCurrencyConverterProvider();
    fakeCacheProvider = new FakeCacheProvider();
    fakeDateProvider = new FakeDateProvider();

    convertCurrencyService = new ConvertCurrencyService(
      fakeCurrencyConverterProvider,
      fakeCurrenciesRepository,
      fakeCacheProvider,
      fakeDateProvider,
    );
  });

  it('should be able to convert original currencies', async () => {
    const result = await convertCurrencyService.execute({
      from: 'brl',
      to: 'usd',
      amount: '1',
    });

    expect(result).toBe(currencies.brl.usd);
  });

  it('should be able to convert original currencies (with cache)', async () => {
    await convertCurrencyService.execute({
      from: 'brl',
      to: 'usd',
      amount: '1',
    });

    const result = await convertCurrencyService.execute({
      from: 'brl',
      to: 'usd',
      amount: '1',
    });

    expect(result).toBe(currencies.brl.usd);
  });

  it('should be able to convert an original currency and a created currency', async () => {
    const currency = await fakeCurrenciesRepository.create({
      code: 'abc',
      backingCurrency: {
        code: 'brl',
        amount: 2,
      },
    });

    const amountOne = 9.94723845623846;
    const resultOne = await convertCurrencyService.execute({
      from: currency.code,
      to: 'usd',
      amount: `${amountOne}`,
    });

    const amountTwo = 2.5;
    const resultTwo = await convertCurrencyService.execute({
      from: 'btc',
      to: currency.code,
      amount: `${amountTwo}`,
    });

    expect(round(resultOne)).toBe(
      round(
        currencies[currency.backingCurrency.code as 'brl'].usd *
          currency.backingCurrency.amount *
          amountOne,
      ),
    );

    expect(round(resultTwo)).toBe(
      round(
        (currencies.btc[currency.backingCurrency.code as 'brl'] /
          currency.backingCurrency.amount) *
          amountTwo,
      ),
    );
  });

  it('should be able to convert between two created currencies', async () => {
    const currencyOne = await fakeCurrenciesRepository.create({
      code: 'abc',
      backingCurrency: {
        code: 'brl',
        amount: 10,
      },
    });

    const currencyTwo = await fakeCurrenciesRepository.create({
      code: 'xyz',
      backingCurrency: {
        code: 'usd' as const,
        amount: 10,
      },
    });

    const amountOne = 2;
    const resultOne = await convertCurrencyService.execute({
      from: currencyOne.code,
      to: currencyTwo.code,
      amount: `${amountOne}`,
    });

    const amountTwo = 6;
    const resultTwo = await convertCurrencyService.execute({
      from: currencyTwo.code,
      to: currencyOne.code,
      amount: `${amountTwo}`,
    });

    expect(round(resultOne)).toBe(
      round(
        ((currencies[currencyOne.backingCurrency.code as 'brl'][
          currencyTwo.backingCurrency.code as 'usd'
        ] *
          currencyOne.backingCurrency.amount) /
          currencyTwo.backingCurrency.amount) *
          amountOne,
      ),
    );

    expect(round(resultTwo)).toBe(
      round(
        ((currencies[currencyTwo.backingCurrency.code as 'usd'][
          currencyOne.backingCurrency.code as 'brl'
        ] *
          currencyTwo.backingCurrency.amount) /
          currencyOne.backingCurrency.amount) *
          amountTwo,
      ),
    );
  });

  it('should not be able to convert if currency (from) does not exist', async () => {
    const currency = await fakeCurrenciesRepository.create({
      code: 'abc',
      backingCurrency: {
        code: 'brl',
        amount: 10,
      },
    });

    await expect(
      convertCurrencyService.execute({
        from: 'any-code',
        to: currency.code,
        amount: `15`,
      }),
    ).rejects.toEqual(
      new AppError('Currency with code "any-code" does not exist', 404),
    );
  });

  it('should not be able to convert if currency (to) does not exist', async () => {
    const currency = await fakeCurrenciesRepository.create({
      code: 'abc',
      backingCurrency: {
        code: 'brl',
        amount: 10,
      },
    });

    await expect(
      convertCurrencyService.execute({
        from: currency.code,
        to: 'any-code',
        amount: `15`,
      }),
    ).rejects.toEqual(
      new AppError('Currency with code "any-code" does not exist', 404),
    );
  });
});
