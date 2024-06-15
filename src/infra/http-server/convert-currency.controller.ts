import { ConvertCurrency } from '@/application/use-case';
import { InvalidParamError, NotFoundError } from '@/domain/errors';
import { Controller, Request, Response } from '@/infra/http-server/controller';

export class ConvertCurrencyController implements Controller {
  constructor(private readonly convertCurrency: ConvertCurrency) {}

  async handle({ query }: Request): Promise<Response> {
    try {
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
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        return {
          statusCode: 404,
          data: { message: error.message },
        };
      }
      if (error instanceof InvalidParamError) {
        return {
          statusCode: 400,
          data: { message: error.message },
        };
      }
      throw error;
    }
  }
}

export default ConvertCurrencyController;
