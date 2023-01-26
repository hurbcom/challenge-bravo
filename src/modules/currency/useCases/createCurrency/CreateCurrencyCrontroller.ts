import { Request, Response } from "express";

import { CreateCurrencyUseCase } from "./CreateCurrencyUseCase";

class CreateCurrencyController {
    constructor(private createCurrencyUseCase: CreateCurrencyUseCase) {}

    async handle(request: Request, response: Response): Promise<Response> {
        const { code, codein, bid, ask, name, high, low } = request.body;
        try {
            await this.createCurrencyUseCase.execute({
                code,
                codein,
                name,
                high,
                bid,
                ask,
                low,
            });

            return response.status(201).send();
        } catch (error) {
            return response.status(500).send({ message: error.message });
        }
    }
}

export { CreateCurrencyController };
