const redis = require("redis");
const client  = redis.createClient(7001,"127.0.0.1");

client.on('connect', function() {
    console.log('Connected');
  });

module.exports = client
  