import {
  CreateCurrencyRate,
  CreateCurrencyRateDto,
} from '@/application/use-case';
import { HttpServer } from '@/infra/http-server';

export class CreateCurrencyController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly createCurrencyRate: CreateCurrencyRate
  ) {
    this.httpServer.register('post', '/currencies', async ({ body }) => {
      try {
        const input: CreateCurrencyRateDto = {
          name: body.name,
          code: body.code,
          symbol: body.symbol,
          decimalPoints: body.decimalPoints,
          baseAmount: body.baseAmount,
          equivalentCurrencyAmount: body.equivalentCurrencyAmount,
          equivalentCurrencyCode: body.equivalentCurrencyCode,
        };
        const output = await this.createCurrencyRate.execute(input);
        return output;
      } catch (error: any) {
        console.error(error.message);
        throw error;
      }
    });
  }
}

export default CreateCurrencyController;
