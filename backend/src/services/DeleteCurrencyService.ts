import { inject, injectable } from 'tsyringe';

import { ICacheProvider } from '@container/providers/CacheProvider/models/ICacheProvider';

import { ICurrenciesRepository } from '@repositories/models/ICurrenciesRepository';

interface IRequest {
  code: string;
}

@injectable()
export class DeleteCurrencyService {
  constructor(
    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ code }: IRequest): Promise<void> {
    await this.currenciesRepository.deleteByCode(code);

    await this.cacheProvider.invalidatePrefix('list-all-currencies');
    await this.cacheProvider.invalidate(`list-one-currency:${code}`);
  }
}
