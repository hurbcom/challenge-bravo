import { Request, Response } from 'express';
import { IConvertCoinRequestDTO } from './ConvertCoinDTO';
import { ConvertCoinUseCase } from './ConvertCoinUseCase';

export class ConvertCoinController {
  constructor(private convertCoinUseCase: ConvertCoinUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { from, to, amount }: IConvertCoinRequestDTO = request.body;

    try {
      if (!from || !to || !amount) {
        return response.status(400).send('Faltou preencher algum parâmetro');
      }

      const result = await this.convertCoinUseCase.execute({
        from,
        to,
        amount,
      });

      return response.status(201).json(result);
    } catch (err) {
      return response.status(400).json({
        message: err.message || 'Unexpected error.',
      });
    }
  }
}
