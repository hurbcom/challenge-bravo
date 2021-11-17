"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cotation = void 0;
class Cotation {
    constructor(id, code, codein, name, high, low, varBid, pctChange, bid, ask, timestamp, createDate) {
        this.id = id;
        this.code = code;
        this.codein = codein;
        this.name = name;
        this.high = high;
        this.low = low;
        this.varBid = varBid;
        this.pctChange = pctChange;
        this.bid = bid;
        this.ask = ask;
        this.timestamp = timestamp;
        this.createDate = createDate;
    }
}
exports.Cotation = Cotation;
//# sourceMappingURL=Cotation.js.map