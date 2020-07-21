let express = require("express");
const { default: Container } = require("typedi");
let updateJob = require("./jobs/update-rates-job")
let ExchangeRatesService = require( "./services/exchange-rates-service");

app = express(),
	port = 3000;
app.listen(port);
app.get('/api/v1/currency-rates/latest', function (req, res) { 
	Container.get(ExchangeRatesService).getLatestExchangeRates().then( x=>{
		return res.json(x);
	})
 });

console.log('Challenge Bravo RESTful API server started on: ' + port);

updateJob.initJob()