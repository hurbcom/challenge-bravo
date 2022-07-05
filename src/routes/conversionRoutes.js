const express = require("express");
const ConversionController = require("../controller/conversionController");

const router = express.Router()

router.get('/', ConversionController.convert);

module.exports = app => app.use("/convert", router);