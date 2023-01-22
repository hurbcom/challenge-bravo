import { Request, Response } from "express";

import { ListQuotationsUseCase } from "./ListQuotationsUseCase";

class ListQuotationsController {
    constructor(private listQuotationsUseCase: ListQuotationsUseCase) {}

    handle(request: Request, response: Response): Response {
        const allQuotataions = this.listQuotationsUseCase.execute();

        return response.json(allQuotataions);
    }
}

export { ListQuotationsController };
