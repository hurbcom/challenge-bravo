import express from "express";
import CurrencyController from "../controllers/currencyController.js";

const route = express.Router();

route
    .get('/currency', CurrencyController.getCurrencies)
    .get('/currency/:code', CurrencyController.getCurrency)
    .post('/currency', CurrencyController.postCurrency)
    .delete('/currency/:code', CurrencyController.deleteCurrency)

export default route;