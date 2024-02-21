const redis = require("redis");

module.exports = {
    set: async (key, value) => {
        try {
            const redisClient = redis.createClient({
                url: process.env.REDIS_HOST_TLS,
                password: process.env.REDIS_PASSWORD_TLS
            });
    
            await redisClient.connect();
            
            await redisClient.set(key, value);
    
            await redisClient.disconnect();
        } catch (error) {
            throw new Error(error);
        }
    },
    get: async (key) => {
        try {
            const redisClient = redis.createClient({
                url: process.env.REDIS_HOST_TLS,
                password: process.env.REDIS_PASSWORD_TLS
            });

            await redisClient.connect();
            
            const msg = await redisClient.get(key);
            await redisClient.disconnect();
            return msg;
        } catch (error) {
            throw new Error(error);
        }
    }
};
