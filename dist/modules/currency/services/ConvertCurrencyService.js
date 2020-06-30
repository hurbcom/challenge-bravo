"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConvertCurrencyService = /** @class */ (function () {
    function ConvertCurrencyService(currencyRepository, redisRepository) {
        this.currencyRepository = currencyRepository;
        this.redisRepository = redisRepository;
    }
    ConvertCurrencyService.prototype.execute = function (fromCurrency, toCurrency, amount) {
        var _a, _b;
        var fromCurrencyValue = (_a = this.currencyRepository.find(fromCurrency)) === null || _a === void 0 ? void 0 : _a.baseValue;
        var toCurrencyValue = (_b = this.currencyRepository.find(toCurrency)) === null || _b === void 0 ? void 0 : _b.baseValue;
        if (fromCurrencyValue && toCurrencyValue) {
            var result = (amount * fromCurrencyValue) / toCurrencyValue;
            return result;
        }
        return;
    };
    return ConvertCurrencyService;
}());
exports.default = ConvertCurrencyService;
