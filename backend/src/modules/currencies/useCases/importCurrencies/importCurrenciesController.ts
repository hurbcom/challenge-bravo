import { Response, Request } from "express";

import { ImportCurrenciesUseCase } from "./importCurrenciesUseCase";

class ImportCurrenciesController {
    constructor(private importCurrenciesUseCase: ImportCurrenciesUseCase) {}

    handle(request: Request, response: Response): Response {
        const { file } = request;
        this.importCurrenciesUseCase.execute(file);
        return response.send();
    }
}

export { ImportCurrenciesController };
