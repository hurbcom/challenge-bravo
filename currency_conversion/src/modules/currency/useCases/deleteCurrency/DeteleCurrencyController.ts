import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeleteCurrencyUseCase } from "./DeleteCurrencyUseCase";

class DeteleCurrencyController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;

    console.log(request);

    const deleteCurrencyUseCase = container.resolve(DeleteCurrencyUseCase);

    await deleteCurrencyUseCase.execute({ id });

    return response.status(200).send();
  }
}

export { DeteleCurrencyController };
