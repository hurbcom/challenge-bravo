"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const CotationController_1 = require("./controller/CotationController");
app_1.default.get("/cotation", (req, res) => {
    console.log("entrou aqui");
    const cotationController = new CotationController_1.CotationController();
    cotationController.get(req, res);
});
//# sourceMappingURL=index.js.map