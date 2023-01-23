import { Request, Response } from "express";

import { ListCurrencyUseCase } from "./ListCurrencyUseCase";

class ListCurrencyController {
    constructor(private listCurrencyUseCase: ListQuotationsUseCase) {}

    handle(request: Request, response: Response): Response {
        const allQuotataions = this.listCurrencyUseCase.execute();

        return response.json(allQuotataions);
    }
}

export { ListCurrencyController };
