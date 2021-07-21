import Router from "express-promise-router";



import { CurrencyController } from './controllers/CurrencyController'
import conversionCurrencyValidator from "./validators/conversionCurrencyValidator";
import createCurrencyValidator from "./validators/createCurrencyValidator";

const router = Router();

const currencyController = new CurrencyController();

router.get("/currency", currencyController.listAll);

router.get("/currency/conversion", conversionCurrencyValidator, currencyController.conversionOfCurrency);

router.get("/currency/currentQuote", currencyController.currentQuote);

router.post("/currency", createCurrencyValidator, currencyController.create);

router.put("/currency/edit/:id", createCurrencyValidator, currencyController.update);

router.delete("/currency/:id", currencyController.delete);


export { router };