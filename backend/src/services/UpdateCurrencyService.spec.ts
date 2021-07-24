import 'reflect-metadata';

import { FakeCacheProvider } from '@container/providers/CacheProvider/fakes/FakeCacheProvider';

import { AppError } from '@errors/AppError';

import { FakeCurrenciesRepository } from '@repositories/fakes/FakeCurrenciesRepository';

import { originalCurrencyCodes } from '@utils/originalCurrencyCodes';

import { UpdateCurrencyService } from './UpdateCurrencyService';

let fakeCacheProvider: FakeCacheProvider;

let fakeCurrenciesRepository: FakeCurrenciesRepository;

let updateCurrencyService: UpdateCurrencyService;

describe('UpdateCurrencyService', () => {
  beforeEach(() => {
    fakeCurrenciesRepository = new FakeCurrenciesRepository();

    fakeCacheProvider = new FakeCacheProvider();

    updateCurrencyService = new UpdateCurrencyService(
      fakeCurrenciesRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to update currency', async () => {
    const code = 'abc';

    await fakeCurrenciesRepository.create({
      code,
      backingCurrency: { code: 'brl', amount: 5.2 },
    });

    const updatedCurrency = await updateCurrencyService.execute({
      code,
      backingCurrency: {
        code: 'usd',
        amount: 1.1,
      },
    });

    expect(updatedCurrency.code).toBe(code);
    expect(updatedCurrency.backingCurrency.code).toBe('usd');
    expect(updatedCurrency.backingCurrency.amount).toBe(1.1);
  });

  it('should not be able to update currency with invalid backing currency code', async () => {
    const code = 'abc';

    await fakeCurrenciesRepository.create({
      code,
      backingCurrency: { code: 'brl', amount: 5.2 },
    });

    await expect(
      updateCurrencyService.execute({
        code,
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

  it("should not be able to update currency if it doesn't exist", async () => {
    await expect(
      updateCurrencyService.execute({
        code: 'any-code',
        backingCurrency: { code: 'brl', amount: 100 },
      }),
    ).rejects.toEqual(
      new AppError(`Currency with code "any-code" doesn't exist.`, 404),
    );
  });
});
