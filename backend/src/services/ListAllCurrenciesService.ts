import { inject, injectable } from 'tsyringe';

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
  ) {}

  public async execute(): Promise<IResponse> {
    const currencies = await this.currenciesRepository.findAll();

    return { count: currencies.length, currencies };
  }
}
