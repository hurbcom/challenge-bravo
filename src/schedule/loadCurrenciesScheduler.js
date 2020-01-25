const loadCurrenciesScheduler = require('node-schedule');
const currencies = require('../services/loadDataService');
schdedulingUpdateCurrencies = new currencies();

module.exports.init = function () {

    loadCurrenciesScheduler.scheduleJob('0 1-23/2 * * * ', function () {
        schdedulingUpdateCurrencies.scheduleReloadValues();
    });

};
