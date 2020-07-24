const express = require('express');
const Configuration = require('./config/config');
const updateJob = require('./jobs/update-rates-job');
const Router = require('./router');

const app = express();
const port = Configuration.PORT || 3000;

app.listen(port);

app.use(express.json());
app.use('/currency', Router);
console.log(`Challenge Bravo RESTful API server started on: ${port}`);

updateJob.initJob();
