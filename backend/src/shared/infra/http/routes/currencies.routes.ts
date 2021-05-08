import { Router } from "express";
import multer from "multer";

import { CreateCurrencyController } from "@modules/currencies/useCases/createCurrency/CreateCurrencyController";
import { DeleteCurrencyController } from "@modules/currencies/useCases/deleteCurrency/DeleteCurrencyController";
import { ImportCurrenciesController } from "@modules/currencies/useCases/importCurrencies/importCurrenciesController";
import { ListCurrenciesController } from "@modules/currencies/useCases/listCurrencies/ListCurrenciesController";

const currenciesRoutes = Router();

const upload = multer({
    dest: "./tmp",
});

const createCurrencyController = new CreateCurrencyController();
const deleteCurrencyController = new DeleteCurrencyController();
const importCurrenciesController = new ImportCurrenciesController();
const listCurrenciesController = new ListCurrenciesController();

currenciesRoutes.post("/", createCurrencyController.handle);
currenciesRoutes.delete("/", deleteCurrencyController.handle);

currenciesRoutes.post(
    "/import",
    upload.single("file"),
    importCurrenciesController.handle
);

currenciesRoutes.get("/", (request, response) => {
    return listCurrenciesController.handle(request, response);
});

export { currenciesRoutes };
