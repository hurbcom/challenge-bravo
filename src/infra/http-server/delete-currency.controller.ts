import { DeleteCurrencyRateByCode } from '@/application/use-case';
import { HttpServer } from '@/infra/http-server';

export class DeleteCurrencyController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly deleteCurrencyRateByCode: DeleteCurrencyRateByCode
  ) {
    this.httpServer.register(
      'delete',
      '/currencies/{code}',
      async ({ params }) => {
        const { code } = params;
        await this.deleteCurrencyRateByCode.execute(code);
        return { message: 'Currency deleted' };
      }
    );
  }
}

export default DeleteCurrencyController;
