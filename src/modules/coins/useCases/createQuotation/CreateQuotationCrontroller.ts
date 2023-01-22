import { Request, Response } from "express";

import { CreateQuotationUseCase } from "./CreateQuotationUseCase";

class CreateQuotationController {
    constructor(private createQuotationUseCase: CreateQuotationUseCase) {}

    handle(request: Request, response: Response): Response {
        const { code, name, high, low } = request.body;

        this.createQuotationUseCase.execute({ code, name, high, low });

        return response.status(201).send();
    }
}

export { CreateQuotationController };
