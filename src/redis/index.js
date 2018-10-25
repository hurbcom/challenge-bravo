//Inicia a conexão com o Redis e disponibiliza o client para os módulos.
const asyncRedis = require("async-redis");
const redisClient = asyncRedis.createClient();

redisClient.on('connect', () => console.log('redis client connected'))
redisClient.on('error', (error) => console.log('something went wrong' + error))

module.exports = redisClient