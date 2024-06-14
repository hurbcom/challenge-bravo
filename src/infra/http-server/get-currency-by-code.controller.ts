import { GetCurrencyRateByCode } from '@/application/use-case';
import { HttpServer } from '@/infra/http-server';

export class GetCurrencyByCodeController {
  constructor(
    readonly httpServer: HttpServer,
    readonly getCurrencyByCode: GetCurrencyRateByCode
  ) {
    httpServer.register('get', '/currencies/{code}', async ({ params }) => {
      try {
        const input = params.code?.toUpperCase();
        const output = await this.getCurrencyByCode.execute(input);
        return output;
      } catch (error: any) {
        console.error(error.message);
        throw error;
      }
    });
  }
}

export default GetCurrencyByCodeController;
