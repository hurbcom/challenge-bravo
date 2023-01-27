import { Router } from "express";

import { currencyRoutes } from "./currency.routes";
import { quotationsRoutes } from "./quotation.routes";

const router = Router();

router.use("/currency", currencyRoutes);
router.use("/quotations", quotationsRoutes);

export { router };
