import { inject, injectable } from 'tsyringe';

import { ICurrencyConverterProvider } from '@container/providers/CurrencyConverterProvider/models/ICurrencyConverterProvider';

import { ICurrency } from '@interfaces/ICurrency';

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
      // Buscar no banco de dados
      const currency: ICurrency = {
        code: 'example1',
        backingCurrency: {
          code: 'usd',
          amount: 10.5,
        },
      };

      from = currency.backingCurrency.code;
      amount *= currency.backingCurrency.amount;
    }

    if (!originalCurrencyCodes.includes(to)) {
      // Buscar no banco de dados
      toCurrency = {
        code: 'example2',
        backingCurrency: {
          code: 'brl',
          amount: 5.19,
        },
      };

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

    return parseFloat(result.toFixed(2));
  }
}
