require('./services/cacheService').instance();
const loadCurrenciesScheduler = require('./schedule/loadCurrenciesScheduler');
require('./services/loadDataService');
const express = require('express'), app = express(), bodyParser = require('body-parser'), compression = require('compression');
const  cacheProvider = require('./services/cacheService').instance();


app.use(compression());

//Rotas
const convertRoutes = require('./routes/convertRoute');
const adminConvertRoutes = require('./routes/convertAdminRoute');

routes();

function routes() {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use('/convert', convertRoutes);
    app.use('/admin/convert', adminConvertRoutes);
    loadCurrenciesScheduler.loadCurrenciesScheduler();
    app.use((error, req, res, next) => {
        res.status(500).json({message: error.message});
    });
}

module.exports = cacheProvider;

module.exports = app;
