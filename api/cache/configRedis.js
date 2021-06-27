const redis = require('promise-redis')();
let client;
if(!process.env.MOCK_REDIS) client = redis.createClient({ url: 'redis://redis_db:6379'});

module.exports = client;