const API_KEY       = process.env.API_KEY
const request       = require('request')
const config        = require('config');

class Currency {
    constructor(){
        this.getCurrencyFromOpenExchangesRates()
    }

    getCurrencyFromOpenExchangesRates(){
        return new Promise((resolve,reject)=>{
            let URL = `${config.openexchangerates.api_url}?app_id=${API_KEY}&show_alternative=true&symbols=USD,BRL,EUR,BTC,ETH`
            request(URL, (error, response, body) => {        
                if(error) this.getCurrencyFromOpenExchangesRates()
                else if(body) this.CURRENCIES = JSON.parse(body)
            });
        })
    }

    getLocalCurrencies(){
        if(this.isCurrenciesAvailable()){
            return this.CURRENCIES
        }
    }

    isCurrenciesAvailable(){
        if(!this.CURRENCIES){
            return false
        }

        return true;
    }


}

module.exports = Currency