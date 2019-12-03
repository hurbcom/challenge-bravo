const express = require("express");
const router = express.Router();
const controller = require("../controllers/converterController");
const { check, validationResult } = require("express-validator");

//Declarando rota de GET para Conversão
router.get(
    "/",
    [
        check("from")
            .not()
            .isEmpty(),
        check("to")
            .not()
            .isEmpty(),
        check("amount")
            .not()
            .isEmpty()
            .isNumeric()
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

        controller.getValue(req, res);
    }
);

module.exports = router;
