import { Router } from "express";
import currecyListController from "../controllers/currency/currencyConversion.controller";
import currecyCreateController from "../controllers/currency/currencyCreate.controller";
import { currencyAlreadyExist } from "../middlewares/currencyAlreadyExist.middleware";

import { validateCurrencyCreate, validateCurrecyCreateSchema } from "./../middlewares/validateCurrencyCreate.middleware";

const routes = Router();

export function currencyRoutes() {
  routes.get("", currecyListController);
  routes.post("", validateCurrencyCreate(validateCurrecyCreateSchema), currencyAlreadyExist, currecyCreateController);
  return routes;
};

