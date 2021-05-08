import { Response, Request } from "express";
import { container } from "tsyringe";

import { DeleteCurrencyUseCase } from "./DeleteCurrencyUseCase";

class DeleteCurrencyController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { symbol } = request.body;

        const deleteCurrencyUseCase = container.resolve(DeleteCurrencyUseCase);

        await deleteCurrencyUseCase.execute({ symbol });

        return response.status(200).send();
    }
}

export { DeleteCurrencyController };
