import { inject, injectable } from 'tsyringe';

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
export class CreateCurrencyService {
  constructor(
    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,
  ) {}

  public async execute({
    code,
    backingCurrency,
  }: IRequest): Promise<ICurrency> {
    if (originalCurrencyCodes.includes(code)) {
      throw new AppError(
        'The currency code cannot be the same as the original currencies.',
        409,
      );
    }

    if (!originalCurrencyCodes.includes(backingCurrency.code)) {
      throw new AppError(
        `Invalid backing currency code. Valid codes: ${originalCurrencyCodes.join(
          ', ',
        )}`,
        400,
      );
    }

    const currencyExists = await this.currenciesRepository.findOne({ code });

    if (currencyExists) {
      throw new AppError('A currency with this code already exists.', 409);
    }

    const currency = await this.currenciesRepository.create({
      code,
      backingCurrency,
    });

    return currency;
  }
}
