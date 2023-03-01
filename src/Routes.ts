import "reflect-metadata";
import "express-async-errors";
import { type CurrencyController } from "./Controller/CurrencyController";

import express from "express";
import injectContainer from "./invesity";

const app = express();

const currencyController =
    injectContainer.get<CurrencyController>("CurrencyController");

app.get("/currency", currencyController.getConversion.bind(currencyController));

export default app;
