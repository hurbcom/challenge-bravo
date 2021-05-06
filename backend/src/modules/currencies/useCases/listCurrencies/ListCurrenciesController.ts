import { Response, Request } from "express";

import { ListCurrenciesUseCase } from "./ListCurrenciesUseCase";

class ListCurrenciesController {
    constructor(private listCurrenciesUseCase: ListCurrenciesUseCase) { }

    handle(request: Request, response: Response): Response {
        const all = this.listCurrenciesUseCase.execute();

        return response.json(all);
    }
}

export { ListCurrenciesController };
