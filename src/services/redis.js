const redis = require("redis");

module.exports = {
    setCache: async (key, value, duration = 3600) => {
        const valueStr = JSON.stringify(value);
        const redisClient = await redis.createClient(
            process.env.REDIS_HOST
        );

        await redisClient.connect();

        await redisClient.AUTH({
            password: process.env.REDIS_PASSWORD
        });

        return await redisClient.set(key, valueStr, 'EX', duration)
    },

    getCache: async (key) => {
        const redisClient = await redis.createClient(
            process.env.REDIS_HOST
        );

        await redisClient.connect();

        await redisClient.AUTH({
            password: process.env.REDIS_PASSWORD
        });

        const results = await redisClient.get(key);

        return JSON.parse(results);
    }
}