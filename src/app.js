require('dotenv').config();
const express = require('express');
const { default: Container } = require('typedi');
const UpdateExchangeRatesJob = require('./jobs/update-exchange-rates-job');
const Router = require('./api/router');
const responseHeadersMiddleware = require('./services/middlewares/response-headers-interceptor');

const app = express();
const port = process.env.PORT;

app.listen(port);
app.use(responseHeadersMiddleware);
app.use(express.json());
app.use('/api', Router);
console.log(`Challenge Bravo RESTful API server started on: ${port}`);

const updateJob = Container.get(UpdateExchangeRatesJob);
updateJob.initJob();
