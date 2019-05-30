var express = require('express');
var conversor = require('../controller/conversor_controller.js');
var router = express.Router();

/* Processa request. */
router.get('/', function (req, res) {
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
});


module.exports = router;
