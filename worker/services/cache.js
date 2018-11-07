
const redis     = require("redis");
class Cache {

    //TODO: criar testes de unidade
    constructor(cb){
        this.redisClient = redis.createClient(process.env.REDIS_HOST)

        this.redisClient.on("error", (e) => {
            console.log("Error " + e);
        });

        this.redisClient.on("ready",()=>{
            console.log("Redis ready")
        });

        this.values = {}
        
    }

    setKey(key,value){
        return new Promise((resolve,reject)=>{
            this.redisClient.set(key, value, (err,r)=>{
                if(err) {
                    reject()
                    return
                }
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
}

module.exports = Cache