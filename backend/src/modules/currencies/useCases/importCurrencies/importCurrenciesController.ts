import { Response, Request } from "express";
import { container } from "tsyringe";

import { ImportCurrenciesUseCase } from "./importCurrenciesUseCase";

class ImportCurrenciesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { file } = request;

        const importCurrenciesUseCase = container.resolve(
            ImportCurrenciesUseCase
        );
        await importCurrenciesUseCase.execute(file);
        return response.send();
    }
}

export { ImportCurrenciesController };
