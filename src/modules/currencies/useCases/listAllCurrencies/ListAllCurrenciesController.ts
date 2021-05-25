import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListAllCurrenciesUseCase } from "./ListAllCurrenciesUseCase";

class ListAllCurrenciesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listAllCurrenciesUseCase = container.resolve(
      ListAllCurrenciesUseCase
    );

    const allCurrencies = await listAllCurrenciesUseCase.execute();

    return response.json(allCurrencies);
  }
}

export { ListAllCurrenciesController };
