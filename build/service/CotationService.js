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
const CacheService_1 = require("./CacheService");
const CotationAlreadyExistsError_1 = require("../error/CotationAlreadyExistsError");
class CotationService {
    constructor() {
        this.get = (from, to) => __awaiter(this, void 0, void 0, function* () {
            const api = new AwesomeApi_1.AwesomeApi();
            try {
                const cotationFromCache = yield this.cacheService.get(`${from}-${to}`);
                if (!cotationFromCache) {
                    const cotation = yield api.getCotation(from, to);
                    const formatedCotation = cotation.data[`${from}${to}`];
                    yield this.cacheService.set(`${from}-${to}`, JSON.stringify(formatedCotation));
                    return formatedCotation;
                }
                return JSON.parse(cotationFromCache);
            }
            catch (error) {
                const cotationFromDatabase = this.getDatabaseByCodeAndCodeIn(from, to);
                if (cotationFromDatabase) {
                    yield this.cacheService.set(`${from}-${to}`, JSON.stringify(cotationFromDatabase));
                    return cotationFromDatabase;
                }
                else {
                    return null;
                }
            }
        });
        this.create = (cotation) => __awaiter(this, void 0, void 0, function* () {
            const cotationFromDatabase = yield this.cotationRepository.getByCodeAndCodeIn(cotation.code, cotation.codein);
            if (cotationFromDatabase) {
                throw new CotationAlreadyExistsError_1.CotationAlreadyExistsError();
            }
            cotation.createDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            cotation.timestamp = new Date().getTime().toString();
            return yield this.cotationRepository.create(cotation);
        });
        this.getDatabaseByCodeAndCodeIn = (code, codeIn) => __awaiter(this, void 0, void 0, function* () {
            return yield this.cotationRepository.getByCodeAndCodeIn(code, codeIn);
        });
        this.delete = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.cotationRepository.deleteById(id);
        });
        this.cotationRepository = new CotationRepository_1.CotationRepository();
        this.cacheService = new CacheService_1.CacheService();
    }
}
exports.CotationService = CotationService;
//# sourceMappingURL=CotationService.js.map