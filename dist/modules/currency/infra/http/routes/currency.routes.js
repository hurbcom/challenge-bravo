"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var CurrencyController_1 = __importDefault(require("../controllers/CurrencyController"));
var currencyController = new CurrencyController_1.default();
var currencyRouter = express_1.Router();
currencyRouter.post('/create', currencyController.create);
currencyRouter.get('/list', currencyController.list);
currencyRouter.get('/convert', currencyController.convert);
exports.default = currencyRouter;
