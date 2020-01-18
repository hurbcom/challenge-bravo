const express = require('express');
var request = require("request");
var cacheProvider = require('./cache').instance();

function Currencies() {

    let base = 'USD';
    let cryptoCoins = ['btc', 'eth'];
    let listOfCoins = ['USD','BRL','EUR'];


    this.loadRates = loadRates;
    this.setRateCoins = setRateCoins;
    this.setCryptoCurrencyRates = setCryptoCurrencyRates;

    return this;

    function loadRates() {
        setCryptoCurrencyRates();
        setRateCoins(base, "base");
        listOfCoins.forEach(function(codinName){
            setRateCoins (codinName, codinName);
          })
          var data = cacheProvider.getAll();
          console.log(data)
    }
    

    function setRateCoins(codinName, keyName) {
        request('https://api.exchangeratesapi.io/latest?base='+codinName, function (error, response, body) {
            var currentRate = JSON.parse(body);
            cacheProvider.set(keyName, "Rate", currentRate.rates.USD);
            var isEnable = !(cacheProvider.get(currentRate.base, "Active"))? false : true ;
            cacheProvider.get(keyName, "Rate")
            cacheProvider.set(keyName, "Active", isEnable);

        })
    }


    function setCryptoCurrencyRates() {
        let coins = concatCoins(cryptoCoins);
        request(`https://min-api.cryptocompare.com/data/price?fsym=${base}&tsyms=${coins}`, function (error, response, body) {
            var currentRate = JSON.parse(body);
            Object.entries(currentRate).forEach(([keyName, value]) => {
                cacheProvider.set(keyName, "Rate", value);
                var isEnable = !(cacheProvider.get(currentRate.base, "Active"))? false : true ;
                cacheProvider.get(keyName, "Rate")
                cacheProvider.set(keyName, "Active", isEnable);
            });
    
        })
    }

    function concatCoins(coins) {
        let res = '';
        cryptoCoins.forEach((val, idx) => {
            if (idx == 0) {
                res = val.toUpperCase();
                return;
            }
            res += ',' + val.toUpperCase();
        });
        return res;
    }
}

module.exports = Currencies;
