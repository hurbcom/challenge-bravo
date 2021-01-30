const router = require('express').Router();
const currenciesController = require("./controllers/currenciesController");

router.post("/addCurrency", currenciesController.addCurrency);
router.delete("/removeCurrency", currenciesController.removeCurrency);

module.exports = router;