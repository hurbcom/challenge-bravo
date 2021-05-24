import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { CreateFictionalCurrencyUseCase } from "./CreateFictionalCurrencyUseCase";

class CreateFictionalCurrencyController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { currencyCode, currencyName, priceUsd } = request.body;

    if (!currencyCode || !currencyName || !priceUsd) {
      throw new AppError("Missing body param!");
    }

    const createFictionalCurrencyUseCase = container.resolve(
      CreateFictionalCurrencyUseCase
    );

    const newFictionalCurrency = await createFictionalCurrencyUseCase.execute({
      currencyCode,
      currencyName,
      priceUsd,
    });

    return response.status(201).json(newFictionalCurrency);
  }
}

export { CreateFictionalCurrencyController };
