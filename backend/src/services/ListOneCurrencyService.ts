import { inject, injectable } from 'tsyringe';

import { ICacheProvider } from '@container/providers/CacheProvider/models/ICacheProvider';

import { AppError } from '@errors/AppError';

import { ICurrency } from '@interfaces/ICurrency';

import { ICurrenciesRepository } from '@repositories/models/ICurrenciesRepository';

interface IRequest {
  code: string;
}

@injectable()
export class ListOneCurrencyService {
  constructor(
    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ code }: IRequest): Promise<ICurrency | null> {
    const cacheKey = `list-one-currency:${code}`;
    const cache = await this.cacheProvider.recover<ICurrency>(cacheKey);

    if (cache?.data) {
      return cache.data;
    }

    const currency = await this.currenciesRepository.findOne({ code });

    if (!currency) {
      throw new AppError(`Currency with code "${code}" doesn't exist.`, 404);
    }

    await this.cacheProvider.save(cacheKey, currency);

    return currency;
  }
}
