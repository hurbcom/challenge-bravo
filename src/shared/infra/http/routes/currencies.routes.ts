import { Router } from "express";

import { CreateCurrencyController } from "../../../../modules/currencies/useCases/createCurrency/CreateCurrencyController";

const currenciesRoutes = Router();

const createCurrencyController = new CreateCurrencyController();

currenciesRoutes.post("/", createCurrencyController.handle);

export { currenciesRoutes };
