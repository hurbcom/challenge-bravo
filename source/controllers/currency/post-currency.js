'use strict'


const Currency = require('../../models/currency');

const saveCurrency = (req, res ) => {

    if(!req.body && !req.body.currencyName) {
        return res.status(400).send({
            message: "Currency name can not be empty"
        });
    }

    const currency = new Currency({
        currencyName: req.body.currencyName
    });

    currency.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while saving currency."
        });
    });

}


module.exports = saveCurrency;