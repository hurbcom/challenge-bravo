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
const axios_1 = __importDefault(require("axios"));
const xml_js_1 = require("xml-js");
const api_error_1 = __importDefault(require("./errors/api-error"));
const currency_error_1 = __importDefault(require("./errors/currency-error"));
const cache_impl_1 = __importDefault(require("./cache-impl"));
class CurrencyConversionImpl {
    constructor() {
        this.validation = new validation_impl_1.default();
        this.cache = new cache_impl_1.default();
    }
    getCurrencyConversion(body) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateCurrencyConversion(body);
            const configs = utils_1.default.loadJsonFileByName("configs.json");
            const apiAvailableConversions = yield this.getAvailableCurrencyConversion();
            const amount = body.amount;
            const quotation = yield this.getCurrencyQuotation(body, configs, apiAvailableConversions);
            const calculatedAmount = this.calculateAmountWithQuotation(amount, quotation);
            return this.getCurrencyConversionResponse(body, calculatedAmount);
        });
    }
    getCurrencyQuotation(body, configs, apiAvailableConversions) {
        return __awaiter(this, void 0, void 0, function* () {
            const from = body.from;
            const to = body.to;
            const fromEntity = this.findCurrencyEntityInConfigs(from, configs);
            const toEntity = this.findCurrencyEntityInConfigs(to, configs);
            const fromUSDQuotation = yield this.getUSDQuotationIfNotFictional(from, fromEntity, apiAvailableConversions);
            const toUSDQuotation = yield this.getUSDQuotationIfNotFictional(to, toEntity, apiAvailableConversions);
            const oneFromQuotation = 1 / fromUSDQuotation;
            const quotation = toUSDQuotation * oneFromQuotation;
            return {
                quotaion: quotation,
                fromUSDQuotation: fromUSDQuotation,
                toUSDQuotation: toUSDQuotation
            };
        });
    }
    findCurrencyEntityInConfigs(currency, configs) {
        return configs.currencies.find(currencyConfig => {
            return currencyConfig.abbreviation.toUpperCase().trim() === currency.toUpperCase().trim();
        });
    }
    checkIfConversionIsAvailableOnThirdParty(conversion, apiAvailableConversions) {
        return apiAvailableConversions.some(availableConversion => { return availableConversion === conversion; });
    }
    calculateAmountWithQuotation(amount, quotation) {
        return (amount / quotation.quotaion).toFixed(4);
    }
    getUSDQuotationIfNotFictional(abbreviation, currencyEntity, apiAvailableConversions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (currencyEntity.isFictional) {
                return Number(currencyEntity.currencyBackingUnitValue);
            }
            if (abbreviation === "USD") {
                return Number(1);
            }
            const conversion = abbreviation + "-" + "USD";
            if (!this.checkIfConversionIsAvailableOnThirdParty(conversion, apiAvailableConversions)) {
                throw new currency_error_1.default('Algo deu errado com a API. Contacte nosso suporte.');
            }
            const quotation = yield this.getQuotationFromThirdParty(conversion);
            return Number(quotation.bid);
        });
    }
    getQuotationFromThirdParty(conversion) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cache.checkIfConversionHasValidCache(conversion)) {
                return this.cache.getQuotationCache(conversion);
            }
            const response = yield this.callThirdPartyApi(conversion);
            this.cache.saveQuotationCache(response, conversion);
            return response;
        });
    }
    callThirdPartyApi(conversion) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get('https://economia.awesomeapi.com.br/last/' + conversion).catch(err => {
                throw new api_error_1.default('Algo deu errado com a API. Contacte nosso suporte.');
            });
            return response.data[conversion.replace('-', '')];
        });
    }
    getAvailableCurrencyConversion() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cache.checkIfExistAvailableApiValidCache()) {
                return this.cache.getAvailableApisCache();
            }
            const response = yield this.callThirdPartyAvailableConversions();
            this.cache.saveAvailableApisCache(response);
            return response;
        });
    }
    callThirdPartyAvailableConversions() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get('https://economia.awesomeapi.com.br/xml/available').catch(err => {
                throw new api_error_1.default("Algo deu errado com a API para verificação de disponibilidade de conversão. Contacte o suporte.");
            });
            const xmlToJson = JSON.parse((0, xml_js_1.xml2json)(response.data, { compact: true, spaces: 4 }));
            return Object.keys(xmlToJson['xml']);
        });
    }
    getCurrencyConversionResponse(body, calculatedAmount) {
        return {
            from: body.from,
            to: body.to,
            originalAmount: body.amount.toFixed(2),
            convertedAmount: calculatedAmount
        };
    }
    validateCurrencyConversion(body) {
        this.validation.checkIfConversionHasSameCurrency(body.from, body.to);
        this.validation.validateCurrencyConversion("from", body.from);
        this.validation.validateCurrencyConversion("to", body.to);
    }
}
exports.default = CurrencyConversionImpl;
