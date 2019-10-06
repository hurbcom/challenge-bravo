'use strict'

const Currency = require('../../models/currency');

const getAllCurrencies = (req, res ) => {
    Currency.find()
        .then(currency => {
            res.send(currency);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving currency."
        });
    });
}


module.exports = getAllCurrencies;