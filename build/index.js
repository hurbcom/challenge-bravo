"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const CotationController_1 = require("./controller/CotationController");
const CoinController_1 = require("./controller/CoinController");
app_1.default.get("/cotation", (req, res) => {
    const cotationController = new CotationController_1.CotationController();
    return cotationController.get(req, res);
});
app_1.default.post("/cotation", (req, res) => {
    const cotationController = new CotationController_1.CotationController();
    return cotationController.create(req, res);
});
app_1.default.post("/coin", (req, res) => {
    const coinController = new CoinController_1.CoinController();
    return coinController.create(req, res);
});
//# sourceMappingURL=index.js.map