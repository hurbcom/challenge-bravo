"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validation_impl_1 = __importDefault(require("./validation-impl"));
const utils_1 = __importDefault(require("./utils"));
class ConfigCurrencyImpl {
    constructor() {
        this.validation = new validation_impl_1.default();
    }
    saveCurrency(body) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validation.checkIfCurrencyAlreadyExists(body.currency);
            const configs = utils_1.default.loadJsonFileByName("configs.json");
            configs.currencies.push(this.createCurrencyEntity(body));
            utils_1.default.saveJsonFile(configs, "configs.json");
        });
    }
    deleteCurrency(body) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validation.checkIfCurrencyCanBeDeleted(body.currency);
            const configs = utils_1.default.loadJsonFileByName("configs.json");
            const indexToDelete = this.findCurrencyIndexInConfigs(body.currency, configs);
            if (indexToDelete === -1) {
                throw new Error("Um Erro Inexperado ocorreu. Não foi possível achar a moeda solicitada");
            }
            configs.currencies.splice(indexToDelete, 1);
            utils_1.default.saveJsonFile(configs, "configs.json");
        });
    }
    findCurrencyIndexInConfigs(currency, configs) {
        return configs.currencies.findIndex(config => {
            return config.abbreviation === currency;
        });
    }
    createCurrencyEntity(body) {
        return {
            abbreviation: body.currency,
            isFictional: body.isFictional ? body.isFictional : false,
            currencyBackingUnitValue: body.currencyBackingUnitValue
        };
    }
}
exports.default = ConfigCurrencyImpl;
