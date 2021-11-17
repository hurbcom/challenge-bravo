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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinService = void 0;
const CoinRepository_1 = require("../repository/CoinRepository");
class CoinService {
    constructor() {
        this.create = (coin) => __awaiter(this, void 0, void 0, function* () {
            const coinRepository = new CoinRepository_1.CoinRepository();
            const createdCoin = yield coinRepository.create(coin);
            console.log(createdCoin);
            return createdCoin;
        });
    }
}
exports.CoinService = CoinService;
//# sourceMappingURL=CoinService.js.map