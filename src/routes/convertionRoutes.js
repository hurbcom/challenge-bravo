const convertionControllers = require("../controllers/convertionControllers");
const currencyValidator = require("../middleware/currencyValidator");
const router = require("express").Router();

router.get(
    "/convert",
    currencyValidator.validate,
    convertionControllers.convertCurrency
);

module.exports = router;
