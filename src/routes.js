const router = require('express').Router();
const currenciesController = require("./controllers/currenciesController");
router.post("/addCurrency", currenciesController.addCurrency);

module.exports = router;