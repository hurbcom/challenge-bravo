import { DeleteCurrencyRateByCode } from '@/application/use-case';
import { CurrencyNotFoundError } from '@/domain/errors';
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
      if (error instanceof CurrencyNotFoundError) {
        return {
          statusCode: 404,
          data: { message: error.message },
        };
      }
      throw error;
    }
  }
}

export default DeleteCurrencyController;
