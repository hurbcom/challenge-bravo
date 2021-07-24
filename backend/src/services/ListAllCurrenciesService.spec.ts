import 'reflect-metadata';

import { FakeCacheProvider } from '@container/providers/CacheProvider/fakes/FakeCacheProvider';

import { FakeCurrenciesRepository } from '@repositories/fakes/FakeCurrenciesRepository';

import { ListAllCurrenciesService } from './ListAllCurrenciesService';

let fakeCacheProvider: FakeCacheProvider;

let fakeCurrenciesRepository: FakeCurrenciesRepository;

let listAllCurrenciesService: ListAllCurrenciesService;

describe('ListAllCurrenciesService', () => {
  beforeEach(() => {
    fakeCurrenciesRepository = new FakeCurrenciesRepository();

    fakeCacheProvider = new FakeCacheProvider();

    listAllCurrenciesService = new ListAllCurrenciesService(
      fakeCurrenciesRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create to list all currencies', async () => {
    const code = 'abc';

    await fakeCurrenciesRepository.create({
      code,
      backingCurrency: { code: 'eth', amount: 0.5 },
    });

    const { currencies } = await listAllCurrenciesService.execute();

    expect(currencies.length).toBe(1);
    expect(currencies[0].code).toBe(code);
  });

  it('should be able to create to list all currencies (with cache)', async () => {
    const code = 'abc';

    await fakeCurrenciesRepository.create({
      code,
      backingCurrency: { code: 'eth', amount: 0.5 },
    });

    await listAllCurrenciesService.execute();

    const { currencies } = await listAllCurrenciesService.execute();

    expect(currencies.length).toBe(1);
    expect(currencies[0].code).toBe(code);
  });
});
