const Currency = require('../models/Currency');

exports.convertCurrency = (req, res, next) => {
    Currency.find({}, function(err, docs) {
        res.status(200).send(docs);
    })
};