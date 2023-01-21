import { Router } from "express";

import { QuotationRepository } from "../repositories/QuotationsRepository";
import { quotationApi } from "../services/api";
import { ALL_COINS as validCoins } from "../services/connections";
import { CrateQuotationService } from "../services/CreateQuotationService";

const quotationRoutes = Router();
const quotationRepository = new QuotationRepository();

quotationRoutes.get("/api-quotations", async (request, response) => {
    const allQuotations = await Promise.all<object>(
        validCoins.map(async (coins) => {
            const request = await quotationApi.get(`/last/${coins}-USD`);
            return request.data;
        })
    );
    response.json(allQuotations);
});

/**
 * endpoint de cadastro de novas moedas
 * @param {object} request.body -> code, name, high, low
 */
quotationRoutes.post("/", (request, response) => {
    const { code, name, high, low } = request.body;

    const createQuotationService = new CrateQuotationService(
        quotationRepository
    );

    createQuotationService.execute({ code, name, high, low });

    return response.status(201).send();
});

quotationRoutes.get("/", (request, response) => {
    const allQuotataions = quotationRepository.list();

    return response.json(allQuotataions);
});

export { quotationRoutes };
