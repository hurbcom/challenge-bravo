"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("./utils"));
class ValidationImpl {
    checkIfCurrencyCanBeDeleted(currency) {
        this.checkIfCurrencyIsNotCurrencyBacking(currency);
        const exists = this.checkCurrencyFromConfigs(currency);
        if (!exists) {
            throw new Error("A moeda: " + currency + " que você está tentando deletar, não existe.");
        }
    }
    checkIfCurrencyAlreadyExists(currency) {
        const exists = this.checkCurrencyFromConfigs(currency);
        if (exists) {
            throw new Error("Moeda: " + currency + " Já está cadastrada.");
        }
    }
    checkIfConversionHasSameCurrency(from, to) {
        if (from === to) {
            throw new Error("Moeda de origem não pode ser igual a moeda de destino.");
        }
    }
    validateCurrencyConversion(field, currency) {
        const exists = this.checkCurrencyFromConfigs(currency);
        if (!exists) {
            throw new Error("Moeda enviada no campo " + field + " não é suportada: " + currency);
        }
    }
    checkIfCurrencyIsNotCurrencyBacking(currency) {
        const configs = utils_1.default.loadJsonFileByName("configs.json");
        if (currency === configs.currencyBacking) {
            throw new Error("OK, Sério que você está tendando deletar a moeda usada como lastro ?");
        }
    }
    checkCurrencyFromConfigs(currency) {
        const configs = utils_1.default.loadJsonFileByName("configs.json");
        return configs.currencies.some(currencyConfig => {
            return currencyConfig.abbreviation === currency;
        });
    }
}
exports.default = ValidationImpl;
