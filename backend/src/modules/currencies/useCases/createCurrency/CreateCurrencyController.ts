import { Response, Request } from "express";

import { CreateCurrencyUseCase } from "./CreateCurrencyUseCase";

class CreateCurrencyController {
    constructor(private createCurrencyUseCase: CreateCurrencyUseCase) {}

    handle(request: Request, response: Response): Response {
        const { symbol } = request.body;

        this.createCurrencyUseCase.execute({ symbol });

        return response.status(201).send();
    }
}

export { CreateCurrencyController };
