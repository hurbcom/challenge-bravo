const { Router } = require("express");
const CurrencyController = require("../controllers/currency.controller");

var CurrencyRouter = new Router();

CurrencyRouter.get("/:currency", CurrencyController.get);
CurrencyRouter.post("/", CurrencyController.post);

exports.CurrencyRouter = CurrencyRouter;