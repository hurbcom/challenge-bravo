const redis     = require("redis");

class Redis {
    constructor(){
        this.client = redis.createClient()
        this.client.on("error", function (err) {
            console.log("Error " + err);
        });

    }

    setKey(key,value){
        return new Promise((resolve,reject)=>{
            this.client.set(key, value, (err,r)=>{
                // redis.print
                if(err) reject(err)
                resolve(r)
            });
        })
    }
}

module.exports = Redis