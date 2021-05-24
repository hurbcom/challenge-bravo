import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { DeleteCurrencyUseCase } from "./DeleteCurrencyUseCase";

class DeleteCurrencyController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { currencyCode } = request.params;

    if (!currencyCode) {
      throw new AppError("Currency code should be informed!");
    }

    const deleteCurrencyUseCase = container.resolve(DeleteCurrencyUseCase);

    await deleteCurrencyUseCase.execute(currencyCode.toLocaleUpperCase());

    return response.status(204).send();
  }
}

export { DeleteCurrencyController };
