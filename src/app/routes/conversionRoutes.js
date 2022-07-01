const express = require("express");
const ConversionController = require("../controller/conversionController");

const router = express.Router()

router.get('/', ConversionController.getAll);
router.get('/:id', ConversionController.getById);
router.post('/', ConversionController.create);
router.put('/:id', ConversionController.update);
router.delete('/:id', ConversionController.delete);

module.exports = app => app.use("/conversion", router);