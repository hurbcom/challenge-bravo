import { Router } from "express";
import multer from "multer";

import { createCurrencyController } from "../modules/currencies/useCases/createCurrency";
import { importCurrenciesController } from "../modules/currencies/useCases/importCurrencies";
import { listCurrenciesController } from "../modules/currencies/useCases/listCurrencies";

const currenciesRoutes = Router();

const upload = multer({
    dest: "./tmp",
});

currenciesRoutes.post("/", (request, response) => {
    return createCurrencyController.handle(request, response);
});

currenciesRoutes.post("/import", upload.single("file"), (request, response) => {
    return importCurrenciesController.handle(request, response);
});

currenciesRoutes.get("/", (request, response) => {
    console.log("reload!");
    return listCurrenciesController.handle(request, response);
});

export { currenciesRoutes };
