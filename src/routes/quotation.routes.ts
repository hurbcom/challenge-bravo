import { Router } from "express";

import { quotations } from "../modules/currency/services/connections";

const quotationsRoutes = Router();

quotationsRoutes.get("/api-quotations", async (request, response) => {
    const allQuotations = await quotations();
    return response.json(allQuotations);
});

export { quotationsRoutes };
