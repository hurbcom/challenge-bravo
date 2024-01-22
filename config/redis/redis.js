
// Criando conexão com redis
const redis = require("redis");
const dotenv = require('dotenv');
dotenv.config();
const passwordRedis = process.env.REDIS_PASSWORD
const portRedis = process.env.REDIS_PORT
const hostRedis = process.env.REDIS_HOST
let client;
(async () => {
  client = redis.createClient({
    socket: {
      port: portRedis,
      host: hostRedis,
      password: passwordRedis
   }
  });
  await client.connect();
})();

module.exports = client;