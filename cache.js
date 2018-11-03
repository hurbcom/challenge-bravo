const config    = require('config')
const request   = require('request')

class Cache {

    constructor(){
        this.values
        this.getLastCurrency()
    }

    /**
     * @description getLastCurrency Get the latest updated result from currencies from "Master Worker"
     * @returns Object
     */
    getLastCurrency(){
        return new Promise((resolve,reject)=>{
            let url = `${config.openexchangerates.api_url}?app_id=8f0b010d875c4ad5822472c1edeb8870&show_alternative=true&symbols=USD,BRL,EUR,BTC,ETH`

            request(url, (error, response, body) => {
                
                //TODO: Tratar status code erros > response && response.statusCode
                if(error) {
                    reject(error)
                    return 
                } else if(body){
                    body = JSON.parse(body)
                    if(body) this.values = body.rates;
                    setTimeout(()=>this.getLastCurrency(), 10 * 1000)
                    resolve(body)
                }
            });
        })
    }

    
    /**
     * @description getValues Returns the last saved values
     * @returns {Object}
     */
    getValues(){
        return this.values
    }

}

module.exports = Cache;