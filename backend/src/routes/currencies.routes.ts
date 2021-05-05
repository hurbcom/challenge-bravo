import { Router } from "express";

import { CurrenciesRepository } from "../repositories/CurrenciesRepository";
import { CreateCurrencyService } from "../services/CreateCurrencyService";

const currenciesRoutes = Router();
const currenciesRepository = new CurrenciesRepository();

currenciesRoutes.post("/", (request, response) => {
    const { symbol } = request.body;

    const createCurrencyService = new CreateCurrencyService(
        currenciesRepository
    );

    createCurrencyService.execute({ symbol });

    return response.status(201).send();
});

currenciesRoutes.get("/", (request, response) => {
    const all = currenciesRepository.list();

    return response.json(all);
});

export { currenciesRoutes };
