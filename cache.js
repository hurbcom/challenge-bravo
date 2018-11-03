const config    = require('config')
const request   = require('request')

class Cache {

    constructor(){
        this.values
        this.getLastCurrency()
    }

    //TODO: melhorar desc
    //TODO:
    /**
     * @description getLastCurrency Get the latest updated result from currencies from "Master Worker"
     * @returns Object
     */
    getLastCurrency(){
        return new Promise((resolve,reject)=>{
            let url = `${config.openexchangerates.api_url}?app_id=${process.env.API_KEY}&show_alternative=true&symbols=USD,BRL,EUR,BTC,ETH`

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

    //TODO: melhorar desc
    /**
     * @description getValues Returns the last saved values
     * @returns {Object}
     */
    getValues(){
        return this.values
    }

}

module.exports = Cache;