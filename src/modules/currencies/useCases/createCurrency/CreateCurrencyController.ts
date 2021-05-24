import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { CreateCurrencyUseCase } from "./CreateCurrencyUseCase";

class CreateCurrencyController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { currencyCode } = request.body;

    if (!currencyCode) {
      throw new AppError("currencyCode not informed!");
    }

    const createCurrencyUseCase = container.resolve(CreateCurrencyUseCase);

    const currency = await createCurrencyUseCase.execute(
      currencyCode.toLocaleUpperCase()
    );

    return response.status(201).json(currency);
  }
}

export { CreateCurrencyController };
