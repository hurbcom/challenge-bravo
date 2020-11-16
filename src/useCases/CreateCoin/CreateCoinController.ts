import { Request, Response } from 'express';
import { ICreateCoinRequestDTO } from './CreateCoinDTO';
import { CreateCoinUseCase } from './CreateCoinUseCase';

export class CreateCoinController {
  constructor(private createCoinUseCase: CreateCoinUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { name }: ICreateCoinRequestDTO = request.body;

    try {
      await this.createCoinUseCase.execute({
        name,
      });

      return response.status(201).send();
    } catch (err) {
      return response.status(400).json({
        message: err.message || 'Unexpected error.',
      });
    }
  }
}
