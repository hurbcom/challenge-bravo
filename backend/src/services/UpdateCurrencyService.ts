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
export class UpdateCurrencyService {
  constructor(
    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,
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

    return updatedCurrency;
  }
}
