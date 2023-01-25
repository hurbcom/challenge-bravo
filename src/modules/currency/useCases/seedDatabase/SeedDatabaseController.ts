import { Request, Response } from "express";

import { SeedDatabaseUseCase } from "./SeedDatabaseUseCase";

class SeedDatabaseController {
    constructor(private seedDatabaseUseCase: SeedDatabaseUseCase) {}

    async handle(request: Request, response: Response): Promise<Response> {
        await this.seedDatabaseUseCase.execute();

        return response.status(201).send("Coins registered in database");
    }
}

export { SeedDatabaseController };
