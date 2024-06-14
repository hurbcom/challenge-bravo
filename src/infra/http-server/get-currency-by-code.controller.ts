import { GetCurrencyRateByCode } from '@/application/use-case';
import { Controller, Request, Response } from '@/infra/http-server/controller';

export class GetCurrencyByCodeController implements Controller {
  constructor(readonly getCurrencyByCode: GetCurrencyRateByCode) {}

  async handle({ params }: Request): Promise<Response> {
    try {
      const input = params.code?.toUpperCase();
      const output = await this.getCurrencyByCode.execute(input);
      return {
        statusCode: 200,
        data: output,
      };
    } catch (error: any) {
      console.error(error.message);
      throw error;
    }
  }
}

export default GetCurrencyByCodeController;
