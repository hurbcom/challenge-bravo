"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("./utils"));
class CacheImpl {
    saveQuotationCache(quotaion, conversion) {
        const cache = utils_1.default.loadJsonFileByName("cache-quotations.json");
        cache[conversion.replace('-', '')] = quotaion;
        utils_1.default.saveJsonFile(cache, "cache-quotations.json");
    }
    saveAvailableApisCache(availableApis) {
        const now = new Date();
        const cache = utils_1.default.loadJsonFileByName("available-conversions.json");
        cache.create_date = now;
        cache.conversions = availableApis;
        utils_1.default.saveJsonFile(cache, "available-conversions.json");
    }
    getQuotationCache(conversion) {
        const cache = utils_1.default.loadJsonFileByName("cache-quotations.json");
        return cache[conversion.replace('-', '')];
    }
    getAvailableApisCache() {
        const cache = utils_1.default.loadJsonFileByName("available-conversions.json");
        return cache.conversions;
    }
    checkIfExistAvailableApiValidCache() {
        const cache = utils_1.default.loadJsonFileByName("available-conversions.json");
        if (cache.create_date !== "") {
            const date = new Date(cache.create_date);
            date.setHours(date.getHours() + 3);
            const now = new Date();
            const teste = [];
            teste.length;
            return ((now.getTime() <= date.getTime()) && cache.conversions.length > 0);
        }
        return false;
    }
    checkIfConversionHasValidCache(conversion) {
        const cache = utils_1.default.loadJsonFileByName("cache-quotations.json");
        let quotaion = cache[conversion.replace('-', '')];
        if (quotaion) {
            const date = new Date(quotaion.create_date);
            date.setHours(date.getHours() + 3);
            const now = new Date();
            return now.getTime() <= date.getTime();
        }
        return false;
    }
}
exports.default = CacheImpl;
