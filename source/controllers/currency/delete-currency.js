'use strict'

const Currency = require('../../models/currency')

const deleteCurrency = (req, res ) => {
    Currency.findByIdAndRemove(req.params.id)
        .then(currency => {
            if(!currency) {
                return res.status(404).send({
                    message: "Currency not found with id " + req.params.id
                });
            }
            res.send({message: "Currency deleted successfully!"});
        }).catch(err => {
        return res.status(500).send({
            message: "Could not delete currency with id " + req.params.id
        });
    });
}


module.exports = deleteCurrency;