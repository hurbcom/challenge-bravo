const redis = require('redis');
const redisClient = redis.createClient();

redisClient.on('connect', () => console.log('redis client connected'))
redisClient.on('error', (error) => console.log('something went wrong' + err))

module.exports = redisClient