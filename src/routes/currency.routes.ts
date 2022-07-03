import { Router } from "express";

import currecyListController from "../controllers/currency/currencyConversion.controller";
import currecyCreateController from "../controllers/currency/currencyCreate.controller";
import currecyDeleteController from "./../controllers/currency/currencyDelete.controller";
import currecyUpdateController from "./../controllers/currency/currencyUpdate.controller";

import { currencyAlreadyExist } from "../middlewares/currency/currencyAlreadyExist.middleware";
import { validateCurrecyCreateSchema, validateCurrencyCreate } from "../middlewares/currency/validateCurrencyCreate.middleware";
import { validateCurrencyUpdate, validateCurrecyUpdateSchema } from "../middlewares/currency/validateCurrencyUpdate.middleware";


const routes = Router();

export function currencyRoutes() {
  routes.get("", currecyListController);
  routes.post("", validateCurrencyCreate(validateCurrecyCreateSchema), currencyAlreadyExist, currecyCreateController);
  routes.delete("/:currency_id", currecyDeleteController);
  routes.patch("/:currency_id", validateCurrencyUpdate(validateCurrecyUpdateSchema), currecyUpdateController);
  return routes;
};

