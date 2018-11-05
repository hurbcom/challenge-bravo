const redis     = require("redis");
const config    = require("config");

class Cache {

    //TODO: criar testes de unidade
    constructor(){
        this.redisClient = redis.createClient()

        this.redisClient.on("error", function (err) {
            console.log("Error " + err);
        });

        this.getLastCurrencies()

    }

    setKey(key,value){
        return new Promise((resolve,reject)=>{
            this.redisClient.set(key, value, (err,r)=>{
                redis.print
                resolve()
            });
        })
    }

    getKey(key){
        return new Promise((resolve,reject)=>{
            this.redisClient.get(key, function(err,r){
                if(r){
                    resolve(r)
                    return
                }

                if(err){
                    reject(err)
                    return
                }
            })
        })
    }

    async getLastCurrencies(){
        let currencies = config.currencies
        for(let c of currencies){
            this.values[c] = await this.getKey(c)
        }
        return this.values
    }
}

module.exports = Cache