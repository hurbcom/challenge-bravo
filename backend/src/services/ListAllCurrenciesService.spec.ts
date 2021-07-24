import 'reflect-metadata';

import { FakeCurrenciesRepository } from '@repositories/fakes/FakeCurrenciesRepository';

import { ListAllCurrenciesService } from './ListAllCurrenciesService';

let fakeCurrenciesRepository: FakeCurrenciesRepository;
let listAllCurrenciesService: ListAllCurrenciesService;

describe('ListAllCurrenciesService', () => {
  beforeEach(() => {
    fakeCurrenciesRepository = new FakeCurrenciesRepository();

    listAllCurrenciesService = new ListAllCurrenciesService(
      fakeCurrenciesRepository,
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
});
