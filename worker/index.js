const API_KEY       = process.env.API_KEY
const URL           = `${config.openexchangerates.api_url}?app_id=${API_KEY}&show_alternative=true&symbols=USD,BRL,EUR,BTC,ETH`
const request       = require('request')
const config        = require('config');
const express       = require('express');
const app           = express();
let CURRENCIES;

app.get('/rates', function (req, res) {
    if(CURRENCIES) {
        res.status(200).send(CURRENCIES)
    }
    
    res.status(500).send({error:"There was an error while trying to convert. Try again"})
});

setInterval(()=> getCurrencyFromOpenExchangesRates(), config.expiration_minutes * 60 * 1000)

function getCurrencyFromOpenExchangesRates(){
    request(URL, (error, response, body) => {        
        if(error) getCurrencyFromOpenExchangesRates()
        else if(body) CURRENCIES = JSON.parse(body)
    });
}

app.listen(process.env.PORT_MASTER || 3000, function () {
  console.log('Example app listening on port!');
});