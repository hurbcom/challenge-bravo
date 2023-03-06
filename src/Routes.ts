import "reflect-metadata";
import "express-async-errors";
import { type CurrencyController } from "./Controller/CurrencyController";

import express from "express";
import injectContainer from "./invesity";
import { type ErrorController } from "./Controller/ErrorController";

const app = express();
app.use(express.json());
const currencyController =
    injectContainer.get<CurrencyController>("CurrencyController");
app.get("/currency", currencyController.getConversion.bind(currencyController));
app.post(
    "/currency",
    currencyController.createCurrency.bind(currencyController)
);
app.delete(
    "/currency/:currencyId",
    currencyController.deleteCurrency.bind(currencyController)
);

const errorConstructor =
    injectContainer.get<ErrorController>("ErrorController");
app.use(errorConstructor.errorHandler.bind(errorConstructor));

export default app;
