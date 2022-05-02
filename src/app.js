const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const currenciesRoutes = require('./routes/currencies.routes');
const exchangesRoutes = require('./routes/exchanges.routes');
const swaggerFile = require('../swagger/swagger_output.json');
const currenciesJobs = require('./jobs/currencies.jobs');

function createServer() {
    const app = express();

    // log api calls
    app.use(morgan('dev'));

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

    // parse application/json
    app.use(bodyParser.json());

    // api routes
    app.use('/currencies', currenciesRoutes);
    app.use('/exchanges', exchangesRoutes);

    // swagger ui
    app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile));

    // currency update job
    currenciesJobs.updateCurrenciesRates();

    return app;
}

module.exports = createServer;
