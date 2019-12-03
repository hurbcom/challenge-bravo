const express = require("express");
const router = express.Router();
const controller = require("../controllers/coinsController");
const { check, validationResult } = require("express-validator");

//Declarando rotas de Coin
router.post(
    "/",
    [
        check("coin")
            .not()
            .isEmpty()
    ],
    (req, res) => {
        //Validação Request
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({
                    sucess: false,
                    error: "Parâmetros de entrada inválidos"
                });
        }

        controller.insertCoin(req, res);
    }
);

router.delete(
    "/",
    [
        check("id")
            .not()
            .isEmpty()
    ],
    (req, res) => {
        //Validação Request
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({
                    sucess: false,
                    error: "Parâmetros de entrada inválidos"
                });
        }

        controller.deleteCoin(req, res);
    }
);

router.get("/", controller.getCoins);

module.exports = router;
