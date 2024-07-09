import express from "express";

import { CurrencyService } from "./application/CurrencyService";
import { CurrencyRepository } from "./infrastructure/repositories/CurrencyRepository";
import { CurrencyController } from "./interfaces/controllers/CurrencyController";
import { setupSwagger } from "./interfaces/validations/Swagger";

const currencyRepository = new CurrencyRepository();
const currencyService = new CurrencyService(currencyRepository);
const currencyController = new CurrencyController(currencyService);

export const routers = (app: express.Application) => {
    app.use(express.json());
    app.get("/api/health", (_: express.Request, res: express.Response) => {
        res.status(200).json({ status: "ok" });
    });
    currencyController.registerRoutes(app);
    setupSwagger(app);
};
