
const { Router } = require("express");

const index = require("./index.routes")
const currencies = require("./currencies.routes");
const converter = require("./converter.routes");

const router = Router();

router.use("/", index);
router.use("/currencies", currencies);
router.use("/converter", converter);


module.exports = router;