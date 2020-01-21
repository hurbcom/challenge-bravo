const currencyLoad = require('node-schedule');
const currencies = require('../services/currenciesService');
schdedulingUpdateCurrencies = new currencies();

module.exports.init = function () {

    currencyLoad.scheduleJob('0 1-23/2 * * * ', function () {
        schdedulingUpdateCurrencies.scheduleReloadValues();
    });

};
