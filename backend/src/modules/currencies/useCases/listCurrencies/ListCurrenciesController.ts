import { Response, Request } from "express";
import { container } from "tsyringe";

import { ListCurrenciesUseCase } from "./ListCurrenciesUseCase";

class ListCurrenciesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listCurrenciesUseCase = container.resolve(ListCurrenciesUseCase);
        const all = await listCurrenciesUseCase.execute();

        return response.json(all);
    }
}

export { ListCurrenciesController };
