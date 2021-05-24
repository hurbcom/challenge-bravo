import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCurrencyUseCase } from "./CreateCurrencyUseCase";

class CreateCurrencyController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { currencyCode } = request.body;

    const createCurrencyUseCase = container.resolve(CreateCurrencyUseCase);

    const currency = await createCurrencyUseCase.execute(currencyCode);

    return response.status(201).json(currency);
  }
}

export { CreateCurrencyController };
