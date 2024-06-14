import { DeleteCurrencyRateByCode } from '@/application/use-case';
import { Controller, Request, Response } from '@/infra/http-server/controller';

export class DeleteCurrencyController implements Controller {
  constructor(
    private readonly deleteCurrencyRateByCode: DeleteCurrencyRateByCode
  ) {}

  async handle({ params }: Request): Promise<Response> {
    try {
      const code = params?.code.toUpperCase();
      await this.deleteCurrencyRateByCode.execute(code);
      return {
        statusCode: 200,
        data: {
          message: 'Currency deleted',
        },
      };
    } catch (error: any) {
      console.error(error.message);
      throw error;
    }
  }
}

export default DeleteCurrencyController;
