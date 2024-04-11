import { Router } from "express";
import { currencyController } from "../controllers/currencyController";
import joi from "../middlewares/requestValidation";
import { schema } from "../models/joiCurrency";

const route = Router();

route.get("/", currencyController.listCurrencies);
route.get("/convert", joi(schema.currency), currencyController.convertCurrency);

route.get(
    "/currency/:code",
    joi(schema.currency),
    currencyController.getCurrency
);
route.post(
    "/currency",
    joi(schema.currency),
    currencyController.createCurrency
);
route.put(
    "/currency/:code",
    joi(schema.currency),
    currencyController.updateCurrency
);
route.delete(
    "/currency/:code",
    joi(schema.currency),
    currencyController.deleteCurrency
);

export default route;
