import { Request, Response } from "express";

import { CreateCurrencyUseCase } from "./CreateCurrencyUseCase";

class CreateCurrencyController {
    constructor(private createCurrencyUseCase: CreateCurrencyUseCase) {}

    async handle(request: Request, response: Response): Promise<Response> {
        const { code, ask, name } = request.body;
        try {
            await this.createCurrencyUseCase.execute({
                code,
                name,
                ask,
            });

            return response.status(201).send();
        } catch (error) {
            return response.status(500).send({ message: error.message });
        }
    }
}

export { CreateCurrencyController };
