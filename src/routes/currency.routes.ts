import { Router } from "express";

import convertCoinsController from "../modules/currency/useCases/convertCoins";
import createCurrencyController from "../modules/currency/useCases/createCurrency";
import listCurrencyController from "../modules/currency/useCases/listCurrencies";

const currencyRoutes = Router();

currencyRoutes.post("/", (request, response) => {
    return createCurrencyController().handle(request, response);
});

currencyRoutes.get("/", (request, response) => {
    return listCurrencyController().handle(request, response);
});

currencyRoutes.post("/convert", (request, response) => {
    return convertCoinsController().handle(request, response);
});

export { currencyRoutes };
