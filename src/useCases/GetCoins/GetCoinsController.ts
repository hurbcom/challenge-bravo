import { Request, Response } from 'express';
import { GetCoinsUseCase } from './GetCoinsUseCase';

export class GetCoinsController {
  constructor(private getCoinsUseCase: GetCoinsUseCase) {}

  async handle(_: Request, response: Response): Promise<Response> {
    try {
      const data = await this.getCoinsUseCase.execute();

      return response.status(201).send(data);
    } catch (err) {
      return response.status(400).json({
        message: err.message || 'Unexpected error.',
      });
    }
  }
}
