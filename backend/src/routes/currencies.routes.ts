import { Router } from "express";

import { createCurrencyController } from "../modules/currencies/useCases/createCurrency";
import { listCurrenciesController } from "../modules/currencies/useCases/listCurrencies";

const currenciesRoutes = Router();

currenciesRoutes.post("/", (request, response) => {
    return createCurrencyController.handle(request, response);
});

currenciesRoutes.get("/", (request, response) => {
    return listCurrenciesController.handle(request, response);
});

export { currenciesRoutes };
