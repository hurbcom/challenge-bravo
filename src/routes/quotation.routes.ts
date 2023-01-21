import { Router } from "express";

import { quotationApi } from "../services/api";
import { ALL_COINS as validCoins } from "../services/connections";

const quotationRouter = Router();

quotationRouter.get("/", async (req, res) => {
    const response = await Promise.all<object>(
        validCoins.map(async (coins) => {
            const request = await quotationApi.get(`/last/${coins}-USD`);
            return request.data;
        })
    );
    res.json(response);
});

export { quotationRouter };
