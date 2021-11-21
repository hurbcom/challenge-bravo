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
exports.CotationRepository = void 0;
const connection_1 = require("../connection");
class CotationRepository {
    constructor() {
        this.create = (cotation) => __awaiter(this, void 0, void 0, function* () {
            const result = yield connection_1.connection.raw(`

        INSERT INTO hurb_cotation (code, codein, name, high, low, varBid,
             pctChange, bid, ask, timestamp, createDate) VALUES ('${cotation.code}', '${cotation.codein}','${cotation.name}',
             '${cotation.high}', '${cotation.low}', '${cotation.varBid}','${cotation.pctChange}','${cotation.bid}',
             '${cotation.ask}', '${cotation.timestamp}', '${cotation.createDate}')
    `);
            return result[0][0];
        });
        this.getByCodeAndCodeIn = (code, codeIn) => __awaiter(this, void 0, void 0, function* () {
            const result = yield connection_1.connection.raw(`
            SELECT * FROM hurb_cotation WHERE code = ('${code}') AND codein = ('${codeIn}')
        `);
            return result[0][0];
        });
        this.deleteByCodeAndCodein = (code, codein) => __awaiter(this, void 0, void 0, function* () {
            const result = yield connection_1.connection.raw(`
            DELETE FROM hurb_cotation WHERE code = '${code}' and codein = '${codein}'
        `);
            return result[0];
        });
    }
}
exports.CotationRepository = CotationRepository;
//# sourceMappingURL=CotationRepository.js.map