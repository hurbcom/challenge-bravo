const schedule = require('node-schedule');
var currencies = require('../services/currencies');

module.exports.init = function () {
    schedule.scheduleJob('* * * * * ', function(){
        console.log("teste")
        currencies().loadRates();
  })

    schedule.scheduleJob('* */6 * * 1-5 ', function(){
        currencies().loadRates();
  })
};
