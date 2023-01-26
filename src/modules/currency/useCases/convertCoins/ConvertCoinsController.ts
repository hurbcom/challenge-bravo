import { Request, Response } from "express";

import { ConvertCoinsUseCase } from "./ConvertCoinsUseCase";

class ConvertCoinsController {
    constructor(private convertCoinsUseCase: ConvertCoinsUseCase) {}

    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const { from, to, amount } = request.query;
            const convertion = await this.convertCoinsUseCase.execute({
                from,
                to,
                amount,
            });
            return response.status(200).json({
                message: `Convertion ${from} to ${to} is ${convertion}`,
            });
        } catch (error) {
            return response.status(500).send({ message: error.message });
        }
    }
}

export { ConvertCoinsController };
