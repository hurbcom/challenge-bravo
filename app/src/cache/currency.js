const redis = require('redis');
const redisClient = redis.createClient({
    url: "redis://redis:6379"
});

module.exports = app => {
    const cache = {
        save: async (key, value) => {
            return new Promise((resolve, reject) => {
                redisClient.set(key, value, (err, reply) => {
                    if (err) reject(null);
                    resolve(true);
                });
            });

        },
        get: async (key) => {

            return new Promise((resolve, reject) => {
                redisClient.get(key, (err, reply) => {
                    if (err) reject(null);

                    resolve(reply);
                });
            });
        }
    };

    return cache;
}