import 'reflect-metadata';

import { FakeCacheProvider } from '@container/providers/CacheProvider/fakes/FakeCacheProvider';

import { AppError } from '@errors/AppError';

import { FakeCurrenciesRepository } from '@repositories/fakes/FakeCurrenciesRepository';

import { ListOneCurrencyService } from './ListOneCurrencyService';

let fakeCacheProvider: FakeCacheProvider;

let fakeCurrenciesRepository: FakeCurrenciesRepository;

let listOneCurrencyService: ListOneCurrencyService;

describe('ListOneCurrencyService', () => {
  beforeEach(() => {
    fakeCurrenciesRepository = new FakeCurrenciesRepository();

    fakeCacheProvider = new FakeCacheProvider();

    listOneCurrencyService = new ListOneCurrencyService(
      fakeCurrenciesRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create to list currency by code', async () => {
    const code = 'abc';

    await fakeCurrenciesRepository.create({
      code,
      backingCurrency: { code: 'eth', amount: 0.5 },
    });

    const currency = await listOneCurrencyService.execute({
      code,
    });

    expect(currency?.code).toBe(code);
    expect(currency?.backingCurrency.code).toBe('eth');
    expect(currency?.backingCurrency.amount).toBe(0.5);
  });

  it('should be able to create to list currency by code (with cache)', async () => {
    const code = 'abc';

    await fakeCurrenciesRepository.create({
      code,
      backingCurrency: { code: 'eth', amount: 0.5 },
    });

    await listOneCurrencyService.execute({
      code,
    });

    const currency = await listOneCurrencyService.execute({
      code,
    });

    expect(currency?.code).toBe(code);
    expect(currency?.backingCurrency.code).toBe('eth');
    expect(currency?.backingCurrency.amount).toBe(0.5);
  });

  it("should not be able to list currency if it doesn't exist", async () => {
    await expect(
      listOneCurrencyService.execute({
        code: 'any-code',
      }),
    ).rejects.toEqual(
      new AppError(`Currency with code "any-code" doesn't exist.`, 404),
    );
  });
});
