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
const express_1 = require("express");
const CotationAlreadyExistsError_1 = require("../error/CotationAlreadyExistsError");
class CotationController {
    constructor() {
        this.path = '/cotations';
        this.router = (0, express_1.Router)();
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!ValidationUtil_1.ValidationUtil.validValue(req.query.from)
                || !ValidationUtil_1.ValidationUtil.validValue(req.query.to)
                || !ValidationUtil_1.ValidationUtil.validValue(req.query.amount)) {
                return res.status(400).send("Invalid parameters.");
            }
            const cotation = yield this.cotationService.get(req.query.from, req.query.to);
            if (ValidationUtil_1.ValidationUtil.validValue(cotation)) {
                const convertedAmount = (Number(req.query.amount) * Number(cotation.ask)).toFixed(2);
                res.send(`Conversion from ${req.query.from} to ${req.query.to} is: ${convertedAmount}`);
            }
            else {
                res.status(404);
            }
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const cotation = req.body;
            if (cotation != null && cotation != undefined) {
                try {
                    const createdCotation = yield this.cotationService.create(cotation);
                    res.status(201).send(createdCotation);
                }
                catch (error) {
                    if (error instanceof CotationAlreadyExistsError_1.CotationAlreadyExistsError) {
                        res.status(400).send(error.message);
                    }
                    else {
                        res.status(500).send();
                    }
                }
            }
            else {
                res.status(400).send("Can't possible create cotation");
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!ValidationUtil_1.ValidationUtil.validValue(req.query.code) || !ValidationUtil_1.ValidationUtil.validValue(req.query.codein)) {
                return res.status(400).send("Invalid parameters");
            }
            yield this.cotationService.deleteByCodeAndCodein(req.query.code, req.query.codein);
            return res.status(200).send();
        });
        this.router.get(`${this.path}`, this.get);
        this.router.post(`${this.path}`, this.create);
        this.router.delete(`${this.path}`, this.delete);
        this.cotationService = new CotationService_1.CotationService();
    }
}
exports.CotationController = CotationController;
//# sourceMappingURL=CotationController.js.map