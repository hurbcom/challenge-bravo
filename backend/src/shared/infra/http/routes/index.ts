import { Router } from "express";

import { currenciesRoutes } from "./currencies.routes";
import { exchangeRoutes } from "./exchanges.routes";

const router = Router();

router.use("/currencies", currenciesRoutes);
router.use("/exchanges", exchangeRoutes);

export { router };
