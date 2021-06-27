const redis = require('promise-redis')();
const client = redis.createClient({ url: 'redis://redis_db:6379'});

module.exports = client;