const express = require("express");
const CurrencyController = require("../controller/currencyController");

const router = express.Router()

router.get('/', CurrencyController.getAll);
router.get('/:id', CurrencyController.getById);
router.post('/', CurrencyController.create);
router.put('/:id', CurrencyController.updateById);
router.delete('/:id', CurrencyController.deleteById);

module.exports = app => app.use("/currency", router);