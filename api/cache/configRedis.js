const redis = require('promise-redis')();
const client = redis.createClient();

module.exports = client;