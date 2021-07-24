import { inject, injectable } from 'tsyringe';

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
  ) {}

  public async execute({ code }: IRequest): Promise<ICurrency | null> {
    const currency = await this.currenciesRepository.findOne({ code });

    if (!currency) {
      throw new AppError(`Currency with code "${code}" doesn't exist.`);
    }

    return currency;
  }
}
