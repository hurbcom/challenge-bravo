import { Router } from "express";

import createCurrencyController from "../modules/currency/useCases/createCurrency";
import listCurrencyController from "../modules/currency/useCases/listCurrencies";
import seedDatabseController from "../modules/currency/useCases/seedDatabase";

const currencyRoutes = Router();

currencyRoutes.post("/", (request, response) => {
    return createCurrencyController().handle(request, response);
});

currencyRoutes.get("/", (request, response) => {
    return listCurrencyController().handle(request, response);
});

currencyRoutes.get("/api-quotations", (request, response) => {
    return seedDatabseController().handle(request, response);
});

export { currencyRoutes };
