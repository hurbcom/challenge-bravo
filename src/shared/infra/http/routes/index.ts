import { Router } from "express";

import { currenciesRoutes } from "./currencies.routes";

const routes = Router();

routes.use("/currencies", currenciesRoutes);

export { routes };
