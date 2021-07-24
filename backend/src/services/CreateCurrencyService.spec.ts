import 'reflect-metadata';

import { AppError } from '@errors/AppError';

import { FakeCurrenciesRepository } from '@repositories/fakes/FakeCurrenciesRepository';

import { originalCurrencyCodes } from '@utils/originalCurrencyCodes';

import { CreateCurrencyService } from './CreateCurrencyService';

let fakeCurrenciesRepository: FakeCurrenciesRepository;
let createCurrencyService: CreateCurrencyService;

describe('CreateCurrencyService', () => {
  beforeEach(() => {
    fakeCurrenciesRepository = new FakeCurrenciesRepository();

    createCurrencyService = new CreateCurrencyService(fakeCurrenciesRepository);
  });

  it('should be able to create a new currency', async () => {
    const code = 'abc';

    const currency = await createCurrencyService.execute({
      code,
      backingCurrency: {
        code: 'btc',
        amount: 0.1,
      },
    });

    expect(currency.code).toBe(code);
    expect(currency.backingCurrency.code).toBe('btc');
    expect(currency.backingCurrency.amount).toBe(0.1);
  });

  it('should not be able to create currency with code same as the original currencies', async () => {
    await expect(
      createCurrencyService.execute({
        code: 'brl',
        backingCurrency: {
          code: 'usd',
          amount: 10,
        },
      }),
    ).rejects.toEqual(
      new AppError(
        'The currency code cannot be the same as the original currencies.',
        409,
      ),
    );
  });

  it('should not be able to create currency with invalid backing currency code', async () => {
    await expect(
      createCurrencyService.execute({
        code: 'abc',
        backingCurrency: { code: 'invalid-code' as 'usd', amount: 100 },
      }),
    ).rejects.toEqual(
      new AppError(
        `Invalid backing currency code. Valid codes: ${originalCurrencyCodes.join(
          ', ',
        )}`,
        400,
      ),
    );
  });

  it('should not be able to create two currencies with the same code', async () => {
    const code = 'abc';

    await fakeCurrenciesRepository.create({
      code,
      backingCurrency: {
        code: 'btc',
        amount: 0.1,
      },
    });

    await expect(
      createCurrencyService.execute({
        code,
        backingCurrency: {
          code: 'usd',
          amount: 10,
        },
      }),
    ).rejects.toEqual(
      new AppError('A currency with this code already exists.', 409),
    );
  });
});
