const mongoose = require('mongoose');

mongo = mongoose.connect('mongodb://banco/myDataBase',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const currencyQuery = require('../Currency/currencyQuery')
currencyQuery.addDefault();

module.exports = mongo