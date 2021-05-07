import { Router } from "express";

import { currenciesRoutes } from "./currencies.routes";

const router = Router();

router.use("/currencies", currenciesRoutes);

export { router };
