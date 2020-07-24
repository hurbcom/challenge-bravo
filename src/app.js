const express = require('express');
const { default: Container } = require('typedi');
const Configuration = require('./config/config');
const UpdateExchangeRatesJob = require('./jobs/update-exchange-rates-job');
const Router = require('./router');
const responseHeadersMiddleware = require('./services/middlewares/response-headers-interceptor');

const app = express();
const port = Configuration.PORT || 3000;

app.listen(port);
app.use(responseHeadersMiddleware);
app.use(express.json());
app.use('/currency', Router);
console.log(`Challenge Bravo RESTful API server started on: ${port}`);

const updateJob = Container.get(UpdateExchangeRatesJob);
updateJob.initJob();
