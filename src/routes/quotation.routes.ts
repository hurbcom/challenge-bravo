import { Router } from "express";

import { quotationApi } from "../modules/coins/services/api";
import { ALL_COINS as validCoins } from "../modules/coins/services/connections";
import { createQuotationController } from "../modules/coins/useCases/createQuotation";
import { listQuotationsController } from "../modules/coins/useCases/listQuotations";

const quotationRoutes = Router();

quotationRoutes.get("/api-quotations", async (request, response) => {
    const allQuotations = await Promise.all<object>(
        validCoins.map(async (coins) => {
            const request = await quotationApi.get(`/last/${coins}-USD`);
            return request.data;
        })
    );
    response.json(allQuotations);
});

quotationRoutes.post("/", (request, response) => {
    return createQuotationController.handle(request, response);
});

quotationRoutes.get("/", (request, response) => {
    return listQuotationsController.handle(request, response);
});

export { quotationRoutes };
