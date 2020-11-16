import { Request, Response } from 'express';
import { ConvertCoinUseCase } from './ConvertCoinUseCase';

export class ConvertCoinController {
  constructor(private convertCoinUseCase: ConvertCoinUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { from, to, amount } = request.query;

    try {
      if (!from || !to || !amount) {
        return response.status(400).send('Faltou preencher algum parâmetro');
      }

      if (
        typeof from !== 'string' ||
        typeof to !== 'string' ||
        typeof amount !== 'string'
      ) {
        return response.status(400).send('Faltou preencher algum parâmetro');
      }

      const traitAmount = Number(amount);

      const result = await this.convertCoinUseCase.execute({
        from,
        to,
        amount: traitAmount,
      });

      if (!result) {
        throw new Error('Ocorreu um erro ao fazer conversão!');
      }

      return response.status(201).json(result);
    } catch (err) {
      return response.status(400).json({
        message: err.message || 'Unexpected error.',
      });
    }
  }
}
