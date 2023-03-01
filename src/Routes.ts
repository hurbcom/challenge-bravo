import "reflect-metadata";
import "express-async-errors";
import { type CurrencyController } from "./Controller/CurrencyController";

import express from "express";
import injectContainer from "./invesity";
import { type ErrorController } from "./Controller/ErrorController";

const app = express();

const currencyController =
    injectContainer.get<CurrencyController>("CurrencyController");
app.get("/currency", currencyController.getConversion.bind(currencyController));

const errorConstructor =
    injectContainer.get<ErrorController>("ErrorController");
app.use(errorConstructor.errorHandler.bind(errorConstructor));

export default app;
