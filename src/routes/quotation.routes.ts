import { Router } from "express";

import { QuotationRepository } from "../repositories/QuotationsRepository";
import { quotationApi } from "../services/api";
import { ALL_COINS as validCoins } from "../services/connections";

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

    const quotationAlredyExists = quotationRepository.findByCode(code);

    if (quotationAlredyExists)
        return response
            .status(400)
            .json({ error: "Coin alredy exists in dastabse!" });

    quotationRepository.create({ code, name, high, low });

    return response.status(201).send();
});

quotationRoutes.get("/", (request, response) => {
    const allQuotataions = quotationRepository.list();

    return response.json(allQuotataions);
});

export { quotationRoutes };
