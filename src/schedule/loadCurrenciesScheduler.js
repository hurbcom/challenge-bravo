const loadCurrenciesScheduler = require('node-schedule');
const currencies = require('../services/loadDataService');
schdedulingUpdateCurrencies = new currencies();

exports.loadCurrenciesScheduler  = function () {
let timeToExecute = '0 1-23/2 * * * ';
timeToExecute = '* * * * *  ';
    loadCurrenciesScheduler.scheduleJob(timeToExecute, function () {
        console.log("Scheduler loading data by ")
        schdedulingUpdateCurrencies.scheduleReloadValues();
    });

};
