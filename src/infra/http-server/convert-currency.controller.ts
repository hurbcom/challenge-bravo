import { ConvertCurrency } from '@/application/use-case';
import { Controller, Request, Response } from '@/infra/http-server/controller';

export class ConvertCurrencyController implements Controller {
  constructor(private readonly convertCurrency: ConvertCurrency) {}

  async handle({ query }: Request): Promise<Response> {
    const input = {
      from: query.from.toUpperCase(),
      to: query.to.toUpperCase(),
      amount: Number(query.amount),
    };
    const output = await this.convertCurrency.execute(input);
    return {
      statusCode: 200,
      data: {
        from: input.from,
        to: input.to,
        givenAmount: input.amount,
        convertedAmount: output.value,
        decimalDigits: output.decimalDigits,
        symbol: output.symbol,
        convertedAmountFormatted: `${output.symbol} ${output.value.toFixed(output.decimalDigits)}`,
      },
    };
  }
}

export default ConvertCurrencyController;
