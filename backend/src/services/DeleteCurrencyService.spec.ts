import 'reflect-metadata';

import { FakeCurrenciesRepository } from '@repositories/fakes/FakeCurrenciesRepository';

import { DeleteCurrencyService } from './DeleteCurrencyService';

let fakeCurrenciesRepository: FakeCurrenciesRepository;
let deleteCurrencyService: DeleteCurrencyService;

describe('DeleteCurrencyService', () => {
  beforeEach(() => {
    fakeCurrenciesRepository = new FakeCurrenciesRepository();

    deleteCurrencyService = new DeleteCurrencyService(fakeCurrenciesRepository);
  });

  it('should be able to delete currency by code', async () => {
    const code = 'abc';

    await fakeCurrenciesRepository.create({
      code,
      backingCurrency: { code: 'eth', amount: 0.5 },
    });

    await expect(
      deleteCurrencyService.execute({ code }),
    ).resolves.not.toThrow();
  });
});
