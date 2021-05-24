import { Router } from "express";

import { CreateCurrencyController } from "../../../../modules/currencies/useCases/createCurrency/CreateCurrencyController";
import { CreateFictionalCurrencyController } from "../../../../modules/currencies/useCases/createFictionalCurrency/CreateFictionalCurrencyController";

const currenciesRoutes = Router();

const createCurrencyController = new CreateCurrencyController();
const createFictionalCurrencyController =
  new CreateFictionalCurrencyController();

currenciesRoutes.post("/", createCurrencyController.handle);
currenciesRoutes.post("/fictional", createFictionalCurrencyController.handle);

export { currenciesRoutes };
