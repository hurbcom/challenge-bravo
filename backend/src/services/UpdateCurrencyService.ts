import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';

import { ICurrency } from '@interfaces/ICurrency';

import { ICurrenciesRepository } from '@repositories/models/ICurrenciesRepository';

import { OriginalCurrencyCode } from '@utils/originalCurrencyCodes';

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
  ) {}

  public async execute({
    code,
    backingCurrency,
  }: IRequest): Promise<ICurrency> {
    const updatedCurrency = await this.currenciesRepository.updateByCode(code, {
      backingCurrency,
    });

    if (!updatedCurrency) {
      throw new AppError(`Currency with code "${code}" doesn't exist.`, 404);
    }

    return updatedCurrency;
  }
}
