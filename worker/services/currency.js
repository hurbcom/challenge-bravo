const request       = require('request')
const config        = require('config');

class Currency {

    constructor(){
        this.values = {}
    }

    /**
     * @description getCurrencyFromOpenExchangesRates is responsible for directly searching the Open Exchanges Rates API for the quotes entered in the application configuration files.
     * @returns {Object}
     */
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

    /**
     * @description isCurrencyValuesChanged is responsible for checking whether the received quote object is different from the object of quotations in memory
     * @param {Object} currencies - currencies object, probably received by the getCurrencyFromOpenExchangesRates
     */
    isCurrencyValuesChanged(currencies){
        return JSON.stringify(this.values) != JSON.stringify(currencies)
    }

    /**
     * @description updateCurrencyValues is responsible for updating the quotations data in memory with the data received by parameter
     * @param {Object} newValues - currencies object, probably received by the getCurrencyFromOpenExchangesRates
     */
    updateCurrencyValues(newValues){
        this.values = newValues
    }

}

module.exports = Currency