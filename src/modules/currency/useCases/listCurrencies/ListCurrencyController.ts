import { Request, Response } from "express";

import { ListCurrencyUseCase } from "./ListCurrencyUseCase";

class ListCurrencyController {
    constructor(private listCurrencyUseCase: ListCurrencyUseCase) {}

    async handle(request: Request, response: Response): Promise<Response> {
        const allCurrencies = await this.listCurrencyUseCase.execute();
        return response.json(allCurrencies);
    }
}

export { ListCurrencyController };
