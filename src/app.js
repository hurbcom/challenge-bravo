const express = require("express");
const updateJob = require("./jobs/update-rates-job")
const Router = require('./router');

app = express(),
	port = 3000;

app.listen(port);

app.use(express.json());
app.use("/", Router);
console.log('Challenge Bravo RESTful API server started on: ' + port);

updateJob.initJob()