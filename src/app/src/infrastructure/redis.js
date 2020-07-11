const IORedis = require("ioredis");

class Redis {
    constructor() {
        this.redis = new IORedis({
            host: process.env.REDIS_HOST || "localhost",
            port: process.env.REDIS_PORT || 6379,
        });
    }


    async get(key) {
        const value = await this.redis.get(key);
        return value ? JSON.parse(value) : null;
    }

    set(key, value, timeExp) {
        return this.redis.set(key, JSON.stringify(value), "EX", timeExp);
    }
}
module.exports = new Redis();