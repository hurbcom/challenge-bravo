import { GetCurrencyByCodeQuery } from '@/application/query/';
import { Controller, Request, Response } from '@/infra/http-server/controller';

export class GetCurrencyByCodeQueryController implements Controller {
  constructor(private readonly getCurrencyByCode: GetCurrencyByCodeQuery) {}

  async handle({ params }: Request): Promise<Response> {
    try {
      const input = {
        code: params.code?.toUpperCase(),
      };
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

export default GetCurrencyByCodeQueryController;
