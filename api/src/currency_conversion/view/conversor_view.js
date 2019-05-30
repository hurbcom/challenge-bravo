const express = require('express');
const conversor = require('../controller/conversor_controller.js');
const validator = require('./validator.js');
const router = express.Router();

/* Processa request. */
router.get('/', function (req, res) {

    if(!validator.validar(req.query)) {
        res.send({
            sucess: false,
            message: 'Os parâmetros necessários não foram enviados corretamente.'
        });
    } else {
        conversor.converter(req.query.from, req.query.to, req.query.amount)
            .then(
                function (converted_value) {
                    console.log(converted_value);

                    res.send({
                        value: converted_value
                    });
                })
            .catch(function (error) {
                console.log(error);
                res.send({
                    sucess: false,
                    message: error
                });
            });
    }
});


module.exports = router;
