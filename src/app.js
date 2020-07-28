require('dotenv').config();
const express = require('express');
const { default: Container } = require('typedi');
const UpdateExchangeRatesJob = require('./jobs/update-exchange-rates-job');
const Router = require('./api/router');
const responseHeadersMiddleware = require('./services/middlewares/response-headers-interceptor');
const Configuration = require('./config/config');

const app = express();
let port = process.env.PORT;
if (!port) {
    port = Configuration.DEFAULT_PORT;
    console.log(`No PORT set into .ENV configuration, using default.`);
}

app.listen(port);
app.use(responseHeadersMiddleware);
app.use(express.json());
app.use('/api', Router);
console.log(`Challenge Bravo REST API server started on: ${port}`);

const updateJob = Container.get(UpdateExchangeRatesJob);
updateJob.initJob();
