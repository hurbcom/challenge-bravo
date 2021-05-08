import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateExchangeUseCase } from "./createExchangeUseCase";

class CreateExchangeController {
    async handle(request: Request, response: Response): Promise<Response> {
        const from = request.query.from.toString();
        const to = request.query.to.toString();
        const amount = parseInt(request.query.amount.toString(), 10);

        const createExchangeUseCase = container.resolve(CreateExchangeUseCase);

        const exchange = await createExchangeUseCase.execute({
            from,
            to,
            amount,
        });

        return response.status(201).json(exchange);
    }
}

export { CreateExchangeController };
