
const redis     = require("redis");
class Cache {

    constructor(){
        this.redisClient = redis.createClient(process.env.REDIS_HOST)

        this.redisClient.on("error", (e) => {
            console.log("Error " + e);
        });
    
        this.redisClient.on("ready",()=>{
            console.log("Redis ready")
        });
        
        this.values = {}
        
    }

    /**
     * @description setKey is responsible for saving to the Redis database a key and value associated with it specified in the parameters
     * @param {String} key - Name of key 
     * @param {Object} value - Value of Key
     */
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

    /**
     * @description getKey is responsible for searching the Redis database for the value of the key specified in the parameters
     * @param {String} key - Name of the key you want to redeem
     * @returns {Object} 
     */
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