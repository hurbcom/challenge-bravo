import { inject, injectable } from 'tsyringe';

import { ICacheProvider } from '@container/providers/CacheProvider/models/ICacheProvider';

import { ICurrency } from '@interfaces/ICurrency';

import { ICurrenciesRepository } from '@repositories/models/ICurrenciesRepository';

interface IResponse {
  count: number;
  currencies: ICurrency[];
}

@injectable()
export class ListAllCurrenciesService {
  constructor(
    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<IResponse> {
    const cacheKey = `list-all-currencies:`;
    const cache = await this.cacheProvider.recover<IResponse>(cacheKey);

    if (cache?.data) {
      return cache.data;
    }

    const currencies = await this.currenciesRepository.findAll();

    const data = { count: currencies.length, currencies };

    await this.cacheProvider.save(cacheKey, data);

    return data;
  }
}
