import { CreateCurrencyRate } from '@/application/use-case';
import { InvalidParamError } from '@/domain/errors';
import { Controller, Request, Response } from '@/infra/http-server/controller';

export class CreateCurrencyController implements Controller {
  constructor(private readonly createCurrencyRate: CreateCurrencyRate) {}

  async handle({ body }: Request): Promise<Response> {
    try {
      const input = {
        name: body.name,
        code: body.code,
        symbol: body.symbol,
        decimalDigits: body.decimalDigits,
        baseAmount: body.baseAmount,
        equivalentCurrencyAmount: body.equivalentCurrencyAmount,
        equivalentCurrencyCode: body.equivalentCurrencyCode,
      };
      const output = await this.createCurrencyRate.execute(input);
      return {
        statusCode: 200,
        data: output,
      };
    } catch (error: any) {
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

export default CreateCurrencyController;
