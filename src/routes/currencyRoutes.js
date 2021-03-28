const currencyController = require("../controllers/currencyControllers");
const router = require("express").Router();

router.get("/currency", currencyController.findCurrencies);
router.get("/currency/:symbol", currencyController.findCurrency);
router.post("/currency", currencyController.createCurrency);
router.delete("/currency/:symbol", currencyController.deleteCurrency);

module.exports = router;
