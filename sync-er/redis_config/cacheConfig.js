const redis = require("redis");
const client  = redis.createClient({
  port: 6379,
  host: 'cache'
});

client.on('connect', function() {
    console.log('Connected');
  });

module.exports = client
  