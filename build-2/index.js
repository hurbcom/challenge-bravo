"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const CotationController_1 = require("./controller/CotationController");
const app = new app_1.default([
    new CotationController_1.CotationController()
]);
app.listen();
//# sourceMappingURL=index.js.map