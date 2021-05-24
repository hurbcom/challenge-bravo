import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { ConvertCurrencyUseCase } from "./ConvertCurrencyUseCase";

class ConvertCurrencyController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { from, to, amount } = request.query;

    if (!from || !to || !amount) {
      throw new AppError("Missing query param");
    }

    const convertCurrencyUseCase = container.resolve(ConvertCurrencyUseCase);

    const result = await convertCurrencyUseCase.execute({
      from: String(from).toLocaleUpperCase(),
      to: String(to).toLocaleUpperCase(),
      amount: Number(amount),
    });

    return response.json(result);
  }
}

export { ConvertCurrencyController };
