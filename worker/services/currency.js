const API_KEY       = process.env.API_KEY
const request       = require('request')
const config        = require('config');

class Currency {

    constructor(){
        this.values = {}
    }

    getCurrencyFromOpenExchangesRates(){
        return new Promise((resolve,reject)=>{
            let currencies = config.currencies.toString();
            let URL = `${config.openexchangerates.api_url}?app_id=${API_KEY}&show_alternative=true&symbols=${currencies}`
            
            request(URL, (error, response, body) => {        
                if(error) {
                    reject(error)
                    return 
                }

                 if(body){
                    resolve(JSON.parse(body))
                    return    
                }

            });
        })
    }

    isCurrencyValuesChanged(currencies){
        if(JSON.stringify(this.values) == JSON.stringify(currencies)) return false
        else return true
    }

    updateCurrencyValues(newValues){
        this.values = newValues
    }

}

module.exports = Currency