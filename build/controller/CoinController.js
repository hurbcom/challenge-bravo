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
exports.CoinController = void 0;
const CoinService_1 = require("../service/CoinService");
class CoinController {
    constructor() {
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const coin = req.body;
            if (coin != null && coin != undefined) {
                const coinService = new CoinService_1.CoinService();
                const createdCoin = yield coinService.create(coin);
                res.status(201).send(createdCoin);
                console.log(createdCoin);
            }
            else {
                res.status(500).send("Erro ao criar nova moeda.");
            }
        });
    }
}
exports.CoinController = CoinController;
//# sourceMappingURL=CoinController.js.map