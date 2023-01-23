import { Router } from "express";

import { quotationApi } from "../modules/currency/services/api";
import { ALL_COINS as validCoins } from "../modules/currency/services/connections";
import createCurrencyController from "../modules/currency/useCases/createCurrency";
import { listCurrencyController } from "../modules/currency/useCases/listCurrencies";

const currencyRoutes = Router();

currencyRoutes.get("/api-quotations", async (request, response) => {
    const allQuotations = await Promise.all<object>(
        validCoins.map(async (coins) => {
            const request = await quotationApi.get(`/last/${coins}-USD`);
            return request.data;
        })
    );
    response.json(allQuotations);
});

currencyRoutes.post("/", (request, response) => {
    return createCurrencyController().handle(request, response);
});

currencyRoutes.get("/", (request, response) => {
    return listCurrencyController.handle(request, response);
});

export { currencyRoutes };
