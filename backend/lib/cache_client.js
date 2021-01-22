const redis = require('redis');
const redisConfig = require('../config/redis');
const { promisify } = require("util");

const client = redis.createClient({
    host: redisConfig.host,
    port: redisConfig.port
});

module.exports = {
    client: client,
    getAsync: promisify(client.get).bind(client),
    setAsync: promisify(client.set).bind(client),
    delAsync: promisify(client.del).bind(client),
    flushallAsync: promisify(client.flushall).bind(client),
    close: (isFlushall) => { client.end(isFlushall) },
}
