'use strict'

const Currency = require('../../models/currency')

const updateCurrency = (req, res ) => {
    if(!req.body.name) {
        return res.status(400).send({
            message: "Currency name can not be empty"
        });
    }

    Currency.findByIdAndUpdate(req.params.id, {
        title: req.body.name
    }, {new: true})
        .then(currency => {
            if(!currency) {
                return res.status(404).send({
                    message: "Currency not found with id " + req.params.id
                });
            }
            res.send(currency);
        }).catch(err => {
        return res.status(500).send({
            message: "Error updating currency with id " + req.params.id + err
        });
    });
}


module.exports = updateCurrency;