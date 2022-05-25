import { Router } from "express";

import { CreateCurrencyController } from "@modules/currency/useCases/createCurrency/CreateCurrencyController";
import { CurrencyExchangeController } from "@modules/currency/useCases/currencyExchange/CurrencyExchangeController";
import { DeteleCurrencyController } from "@modules/currency/useCases/deleteCurrency/DeteleCurrencyController";

const currenciesRoutes = Router();

const createCurrencyController = new CreateCurrencyController();
const deleteCurrencyController = new DeteleCurrencyController();
const currencyExchangeCOntroller = new CurrencyExchangeController();

currenciesRoutes.post("/", createCurrencyController.handle);
currenciesRoutes.delete("/", deleteCurrencyController.handle);
currenciesRoutes.get("/", currencyExchangeCOntroller.handle);

export { currenciesRoutes };
