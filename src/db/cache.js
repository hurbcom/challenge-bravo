 const redis = require('redis');
const redisConfig = require('../config/cache');
const { promisify } = require("util");

const client = redis.createClient({
    host: redisConfig.host,
    port: redisConfig.port
});

module.exports = {
    getAsync: promisify(client.get).bind(client),
    setAsync: promisify(client.set).bind(client),
    delAsync: promisify(client.del).bind(client),
    flushallAsync: promisify(client.flushall).bind(client),
    close: (isFlushall) => { client.end(isFlushall) },
}
 