const router = require('express').Router();
const currenciesController = require("./controllers/currenciesController");

router.post("/addCurrency", currenciesController.addCurrency);
router.delete("/removeCurrency", currenciesController.removeCurrency);
router.get("/convertCurrency", currenciesController.convertCurrency);

module.exports = router;