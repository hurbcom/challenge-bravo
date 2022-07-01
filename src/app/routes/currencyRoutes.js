const express = require("express");
const CurrencyController = require("../controller/currencyController");

const router = express.Router()

router.get('/', CurrencyController.getAll);
router.get('/:id', CurrencyController.getById);
router.post('/', CurrencyController.create);
router.put('/:id', CurrencyController.update);
router.delete('/:id', CurrencyController.delete);

module.exports = app => app.use("/conversion", router);