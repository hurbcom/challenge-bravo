"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Currency_1 = __importDefault(require("../../infra/local/models/Currency"));
var CurrencyRepository = /** @class */ (function () {
    function CurrencyRepository() {
        this.currencies = [
            {
                id: "USD1",
                name: "USD",
                baseValue: 1
            },
            {
                id: "BRL2",
                name: "BRL",
                baseValue: 0.19
            },
            {
                id: "EUR3",
                name: "EUR",
                baseValue: 1.12
            },
            {
                id: "BTC4",
                name: "BTC",
                baseValue: 9239.59
            },
            {
                id: "ETH2",
                name: "ETH",
                baseValue: 234.55
            },
        ];
    }
    CurrencyRepository.prototype.create = function (name, baseValue) {
        var currency = new Currency_1.default(name, baseValue);
        this.currencies.push(currency);
        return currency;
    };
    CurrencyRepository.prototype.list = function () {
        return this.currencies;
    };
    CurrencyRepository.prototype.find = function (name) {
        var currency = this.currencies.find(function (currencies) { return currencies.name === name; });
        return currency;
    };
    return CurrencyRepository;
}());
exports.default = CurrencyRepository;
