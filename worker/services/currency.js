const request       = require('request')
const config        = require('config');

class Currency {

    constructor(){
        this.values = {}
    }

    getCurrencyFromOpenExchangesRates(){
        return new Promise((resolve,reject)=>{
            let currencies = config.currencies.toString();
            console.log("Buscando: ",currencies)
            let URL = `${config.openexchangerates.api_url}?app_id=${process.env.API_KEY_OEX}&show_alternative=true&symbols=${currencies}`
            
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