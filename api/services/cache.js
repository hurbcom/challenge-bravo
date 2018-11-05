
const redis     = require("redis");
//TODO: nao esta conseguindo pegar as variaveis do arquivo de config
const config    = require("config");
class Cache {

    //TODO: criar testes de unidade
    constructor(){
        this.redisClient = redis.createClient(process.env.REDIS_HOST)

        this.redisClient.on("error", (e) => {
            console.log("Error " + e);
        });

        this.redisClient.on("ready",()=>{
            this.updateCurrencies()
        });

        this.values = {}
        
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
        //TODO: colocar moedas em variavel de ambiente
        let currencies = ["USD","BRL","EUR","BTC","ETH"]
        for(let c of currencies){
           try {
                this.values[c] = await this.getKey(c)
           } catch (error) {    
               console.log(error)
           }
        }

        console.log("Currencies atualizadas com sucesso!")
    }

    updateCurrencies(){
        this.getLastCurrencies()
        //TODO: colocar variavel de ambiente
        setInterval(()=>this.getLastCurrencies(), 30 * 1000)
    }
}

module.exports = Cache