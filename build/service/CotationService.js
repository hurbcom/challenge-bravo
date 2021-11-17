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
exports.CotationService = void 0;
const AwesomeApi_1 = require("../client/AwesomeApi");
const CotationRepository_1 = require("../repository/CotationRepository");
class CotationService {
    constructor() {
        this.get = (from, to, amout) => __awaiter(this, void 0, void 0, function* () {
            const api = new AwesomeApi_1.AwesomeApi();
            const cotation = yield api.getCotation(from, to);
            return cotation.data[`${from}${to}`];
        });
        this.create = (cotation) => __awaiter(this, void 0, void 0, function* () {
            const cotationRepositoy = new CotationRepository_1.CotationRepository();
            const createdCotation = yield cotationRepositoy.create(cotation);
            return createdCotation;
        });
    }
}
exports.CotationService = CotationService;
//# sourceMappingURL=CotationService.js.map