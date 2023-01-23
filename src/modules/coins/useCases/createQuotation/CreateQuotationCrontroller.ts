import { Request, Response } from "express";

import { CreateQuotationUseCase } from "./CreateQuotationUseCase";

class CreateQuotationController {
    constructor(private createQuotationUseCase: CreateQuotationUseCase) {}

    async handle(request: Request, response: Response): Promise<Response> {
        const { code, name, high, low } = request.body;

        await this.createQuotationUseCase.execute({ code, name, high, low });

        return response.status(201).send();
    }
}

export { CreateQuotationController };
