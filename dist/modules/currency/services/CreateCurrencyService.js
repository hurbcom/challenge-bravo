"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CreateCurrencyService = /** @class */ (function () {
    function CreateCurrencyService(currencyRepository, redisProvider) {
        this.currencyRepository = currencyRepository;
        this.redisProvider = redisProvider;
    }
    CreateCurrencyService.prototype.execute = function (name, baseValue) {
        var currency = this.redisProvider.save(name, baseValue);
        return currency;
    };
    return CreateCurrencyService;
}());
exports.default = CreateCurrencyService;
