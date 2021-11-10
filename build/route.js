"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CotationController_1 = require("./controller/CotationController");
exports.default = (router) => {
    router.get("/cotation", (req, res) => {
        const cotationController = new CotationController_1.CotationController();
        cotationController.get(req, res);
    });
};
//# sourceMappingURL=route.js.map