import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateCurrencyUseCase } from "./CreateCurrencyUseCase";

class CreateCurrencyController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { symbol } = request.body;

        const createCurrencyUseCase = container.resolve(CreateCurrencyUseCase);

        await createCurrencyUseCase.execute({ symbol });

        return response.status(201).send();
    }
}

export { CreateCurrencyController };
