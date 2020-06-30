"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var currency_routes_1 = __importDefault(require("../../../modules/currency/infra/http/routes/currency.routes"));
var routes = express_1.Router();
routes.use('/currency', currency_routes_1.default);
exports.default = routes;
