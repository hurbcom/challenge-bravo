import { Router } from "express";

import { currencyRoutes } from "./currency.routes";

const router = Router();

router.use("/currency", currencyRoutes);

export { router };
