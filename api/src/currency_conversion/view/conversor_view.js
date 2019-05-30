const express = require('express');
const conversor = require('../controller/conversor_controller.js');
const validator = require('./validator.js');
const router = express.Router();

/**
 * Processa request
 */
router.get('/', function (req, res) {

    const badRequest = validator.validate(req.query);
    if (badRequest) {
        res.send({
            success: false,
            message: badRequest
        });
    } else {
        conversor.converter(req.query.from, req.query.to, req.query.amount)
            .then(
                function (converted_value) {
                    res.send({
                        value: converted_value
                    });
                })
            .catch(function (error) {
                res.send({
                    sucess: false,
                    message: error
                });
            });
    }
});


module.exports = router;
