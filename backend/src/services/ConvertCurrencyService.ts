import { Decimal } from 'decimal.js';
import { inject, injectable } from 'tsyringe';

import { ICacheProvider } from '@container/providers/CacheProvider/models/ICacheProvider';
import { ICurrencyConverterProvider } from '@container/providers/CurrencyConverterProvider/models/ICurrencyConverterProvider';
import { IDateProvider } from '@container/providers/DateProvider/models/IDateProvider';

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

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  public async execute({
    from: inputFrom,
    to: inputTo,
    amount: inputAmount,
  }: IRequest): Promise<number> {
    const cacheKey = `convert-currency:${inputFrom},${inputTo},${inputAmount}`;
    const cache = await this.cacheProvider.recover<number>(cacheKey);

    if (cache?.data) {
      return cache.data;
    }

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

    let result = amount;

    if (from !== to) {
      result = await this.currencyConverterProvider.convert({
        from: from as OriginalCurrencyCode,
        to: to as OriginalCurrencyCode,
        amount: Number(amount),
      });
    }

    if (toCurrency) {
      result /= toCurrency.backingCurrency.amount;
    }

    const formattedResult = Number(new Decimal(result));

    await this.cacheProvider.save(
      cacheKey,
      formattedResult,
      this.dateProvider.addHours(new Date(), 1),
    );

    return formattedResult;
  }
}
