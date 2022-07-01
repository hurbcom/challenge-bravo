const express = require("express");
const ConversionController = require("../controller/conversionController");

const router = express.Router()

router.get('/', ConversionController.getAll);

module.exports = app => app.use("/convert", router);