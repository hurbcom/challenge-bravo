import { GetCurrencyByCodeQuery } from '@/application/query/';
import { HttpServer } from '@/infra/http-server';

export class GetCurrencyByCodeQueryController {
  constructor(
    readonly httpServer: HttpServer,
    readonly getCurrencyByCode: GetCurrencyByCodeQuery
  ) {
    httpServer.register('get', '/currencies/{code}', async ({ query }) => {
      try {
        const input = {
          code: query.code?.toUpperCase(),
        };
        const output = await this.getCurrencyByCode.execute(input);
        return output;
      } catch (error: any) {
        console.error(error.message);
        throw error;
      }
    });
  }
}

export default GetCurrencyByCodeQueryController;
