import 'reflect-metadata';

import { AppError } from '@errors/AppError';

import { FakeCurrenciesRepository } from '@repositories/fakes/FakeCurrenciesRepository';

import { UpdateCurrencyService } from './UpdateCurrencyService';

let fakeCurrenciesRepository: FakeCurrenciesRepository;
let updateCurrencyService: UpdateCurrencyService;

describe('UpdateCurrencyService', () => {
  beforeEach(() => {
    fakeCurrenciesRepository = new FakeCurrenciesRepository();

    updateCurrencyService = new UpdateCurrencyService(fakeCurrenciesRepository);
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
