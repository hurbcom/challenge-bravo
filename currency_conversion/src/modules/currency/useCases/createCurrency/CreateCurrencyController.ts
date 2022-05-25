import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCurrencyUseCase } from "./CreateCurrencyUseCase";

class CreateCurrencyController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const createCurrenciesUseCase = container.resolve(CreateCurrencyUseCase);

    await createCurrenciesUseCase.execute({ name });

    return response.status(201).send();
  }
}

export { CreateCurrencyController };
