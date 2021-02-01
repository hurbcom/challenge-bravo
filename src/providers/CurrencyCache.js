const Redis = require('ioredis');
const redisMock = require("redis-mock");
  
class CurrencyCache {

    constructor() {
        if(process.env.NODE_ENV == 'test') {
            this.redis = redisMock.createClient();
        } else {
            this.redis = new Redis({
                host: "redis",
                port: 6379,
                keyPrefix: "currency-"
            });
        }
    }

    async get(key) {
        if(process.env.NODE_ENV == 'test') {
            return this.redis.get(key);
        } else {
            return await this.redis.get(key);
        }
    }

    set(key, value, timeExp) {
        if(process.env.NODE_ENV == 'test') { 
            return this.redis.set(key, value);
        } else {
            return this.redis.set(key, value, "EX", timeExp);
        }
    }

    del(key) {
        return this.redis.del(key);
    }
}

module.exports = new CurrencyCache();