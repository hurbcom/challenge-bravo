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
exports.CotationController = void 0;
const CotationService_1 = require("../service/CotationService");
const ValidationUtil_1 = require("../util/ValidationUtil");
class CotationController {
    constructor() {
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!ValidationUtil_1.ValidationUtil.validValue(req.query.from)
                || !ValidationUtil_1.ValidationUtil.validValue(req.query.to)
                || !ValidationUtil_1.ValidationUtil.validValue(req.query.amount)) {
                return res.status(400).send("Dados inválidos.");
            }
            const cotationService = new CotationService_1.CotationService();
            const cotation = yield cotationService.get(req.query.from, req.query.to);
            if (ValidationUtil_1.ValidationUtil.validValue(cotation)) {
                res.send(`Conversion from ${req.query.from} to ${req.query.to} is: ${Number(req.query.amount) * Number(cotation.ask)}`);
            }
            else {
                res.status(404);
            }
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const cotation = req.body;
            if (cotation != null && cotation != undefined) {
                const cotationService = new CotationService_1.CotationService();
                const createdCotation = yield cotationService.create(cotation);
                res.status(201).send(createdCotation);
            }
            else {
                res.status(500).send("Erro ao criar nova moeda.");
            }
        });
    }
}
exports.CotationController = CotationController;
//# sourceMappingURL=CotationController.js.map