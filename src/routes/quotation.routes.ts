import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

import { quotationApi } from "../services/api";
import { ALL_COINS as validCoins } from "../services/connections";

const quotationRoutes = Router();

quotationRoutes.get("/", async (request, response) => {
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

    const quotation = {
        code,
        name,
        high,
        low,
        id: uuidv4(),
    };

    return response.status(201).json(quotation);
});

export { quotationRoutes };
