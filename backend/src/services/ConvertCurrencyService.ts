import { Decimal } from 'decimal.js';
import { inject, injectable } from 'tsyringe';

import { ICurrencyConverterProvider } from '@container/providers/CurrencyConverterProvider/models/ICurrencyConverterProvider';

import { AppError } from '@errors/AppError';

import { ICurrency } from '@interfaces/ICurrency';

import { ICurrenciesRepository } from '@repositories/models/ICurrenciesRepository';

import {
  OriginalCurrencyCode,
  originalCurrencyCodes,
} from '@utils/originalCurrencyCodes';

interface IRequest {
  from: string | OriginalCurrencyCode;
  to: string | OriginalCurrencyCode;
  amount: string;
}

@injectable()
export class ConvertCurrencyService {
  constructor(
    @inject('CurrencyConverterProvider')
    private currencyConverterProvider: ICurrencyConverterProvider,

    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,
  ) {}

  public async execute({
    from: inputFrom,
    to: inputTo,
    amount: inputAmount,
  }: IRequest): Promise<number> {
    let from = inputFrom;
    let to = inputTo;
    let amount = Number(inputAmount);
    let toCurrency: ICurrency | null = null;

    if (!originalCurrencyCodes.includes(from)) {
      const currency = await this.currenciesRepository.findOne({ code: from });

      if (!currency) {
        throw new AppError(`Currency with code "${from}" does not exist`, 404);
      }

      from = currency.backingCurrency.code;
      amount *= currency.backingCurrency.amount;
    }

    if (!originalCurrencyCodes.includes(to)) {
      toCurrency = await this.currenciesRepository.findOne({ code: to });

      if (!toCurrency) {
        throw new AppError(`Currency with code "${to}" does not exist`, 404);
      }

      to = toCurrency.backingCurrency.code;
    }

    let result = await this.currencyConverterProvider.convert({
      from: from as OriginalCurrencyCode,
      to: to as OriginalCurrencyCode,
      amount: Number(amount),
    });

    if (toCurrency) {
      result /= toCurrency.backingCurrency.amount;
    }

    return Number(new Decimal(result));
  }
}
