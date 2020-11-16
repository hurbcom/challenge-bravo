import { Request, Response } from 'express';
import { UpdateCoinUseCase } from './UpdateCoinUseCase';

export class UpdateCoinController {
  constructor(private updateCoinUseCase: UpdateCoinUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { uid } = request.params;
    const { name } = request.body;

    try {
      const coinUpdated = await this.updateCoinUseCase.execute({
        uid,
        name,
      });

      return response.status(201).send(coinUpdated);
    } catch (err) {
      return response.status(400).json({
        message: err.message || 'Unexpected error.',
      });
    }
  }
}
