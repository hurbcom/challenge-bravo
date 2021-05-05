import { Router } from "express";

import { CurrenciesRepository } from "../repositories/CurrenciesRepositories";

const currenciesRoutes = Router();
const currenciesRepository = new CurrenciesRepository();

currenciesRoutes.post("/", (request, response) => {
    const { symbol } = request.body;

    const currencyAlreadyExists = currenciesRepository.findBySymbol(symbol);

    if (currencyAlreadyExists) {
        return response.status(400).json({ error: "Currency already exists" });
    }

    currenciesRepository.create({ symbol });

    return response.status(201).send();
});

currenciesRoutes.get("/", (request, response) => {
    const all = currenciesRepository.list();

    return response.json(all);
});

export { currenciesRoutes };
