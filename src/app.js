require('dotenv').config();
const express = require('express');

const { Container } = require('typedi');

const UpdateExchangeRatesJob = require('./jobs/update-exchange-rates-job');
const Router = require('./api/router');
const responseHeadersMiddleware = require('./services/middlewares/response-headers-interceptor');
const Configuration = require('./config/config');

const app = express();

const port = process.env.PORT ? process.env.PORT : Configuration.DEFAULT_PORT;

app.use(responseHeadersMiddleware);
app.use(express.json());
// API Routes
app.use('/api', Router);

app.listen(port, () => {
    console.log(`Challenge Bravo REST API server started on: ${port}`);
});
const updateJob = Container.get(UpdateExchangeRatesJob);
updateJob.initJob();
