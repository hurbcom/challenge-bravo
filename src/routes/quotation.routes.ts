import { Router } from "express";

import seedDatabseController from "../modules/currency/useCases/seedDatabase";

const quotationsRoutes = Router();

quotationsRoutes.put("/update", (request, response) => {
    return seedDatabseController().handle(request, response);
});

export { quotationsRoutes };
