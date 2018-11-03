const config    = require('config')
const request   = require('request')

class Cache {

    constructor(){
        this.getLastCurrency()
    }

    //TODO: terminar descricao do método
    /**
     * @description getLastCurrency Get the latest updated result from currencies from "Master Worker"
     * @returns Object
     */
    getLastCurrency(){
       //TODO: Pegar os valores do master worker
        return new Promise((resolve,reject)=>{
            let url = `${config.worker_url}/currency`

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

}

module.exports = Cache;