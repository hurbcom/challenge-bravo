require('./services/cacheService').instance();
const express = require('express'), app = express(), currencies = require('./services/currenciesService'),
    bodyParser = require('body-parser'), schedule = require('./schedule/currencyLoad'),
    compression = require('compression');



app.use(compression());

//Rotas
const convertRoutes = require('./routes/convertRoute');

main().then(r => {
    console.log(r);
    routes();
});

async function main() {
    console.log("init");
    const {loadRates} = new currencies();
    loadRates();
    schedule.init();
}

function routes() {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use('/convert', convertRoutes);
}

module.exports = app;
