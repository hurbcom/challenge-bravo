import { inject, injectable } from 'tsyringe';

import { ICacheProvider } from '@container/providers/CacheProvider/models/ICacheProvider';

import { AppError } from '@errors/AppError';

import { ICurrency } from '@interfaces/ICurrency';

import { ICurrenciesRepository } from '@repositories/models/ICurrenciesRepository';

import {
  OriginalCurrencyCode,
  originalCurrencyCodes,
} from '@utils/originalCurrencyCodes';

interface IRequest {
  code: string;
  backingCurrency: {
    code: OriginalCurrencyCode;
    amount: number;
  };
}

@injectable()
export class UpdateCurrencyService {
  constructor(
    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    code,
    backingCurrency,
  }: IRequest): Promise<ICurrency> {
    if (!originalCurrencyCodes.includes(backingCurrency.code)) {
      throw new AppError(
        `Invalid backing currency code. Valid codes: ${originalCurrencyCodes.join(
          ', ',
        )}`,
        400,
      );
    }

    const updatedCurrency = await this.currenciesRepository.updateByCode(code, {
      backingCurrency,
    });

    if (!updatedCurrency) {
      throw new AppError(`Currency with code "${code}" doesn't exist.`, 404);
    }

    await this.cacheProvider.invalidatePrefix('list-all-currencies');
    await this.cacheProvider.invalidate(`list-one-currency:${code}`);

    return updatedCurrency;
  }
}
