'use strict'

const Currency = require('../../models/currency')

const getCurrency = (req, res ) => {
    Currency.findById(req.params.id)
        .then(currency => {
            if(!currency) {
                return res.status(404).send({
                    message: "currency not found with id " + req.params.id
                });
            }
            res.send(currency);
        }).catch(err => {
        return res.status(500).send({
            message: "Error retrieving currency with id " + req.params.id
        });
    });
}


module.exports = getCurrency;