/**
 * @description Inicia conexão com o Redis e disponibiliza o client para os modulos
 * @author Mateus Schenatto <mateus.sche@gmail.com>
 */
const asyncRedis = require("async-redis"),
    redisClient = asyncRedis.createClient(process.env.REDIS_URL)

redisClient.on('connect', () => console.log('redis client connected'))
redisClient.on('error', (error) => console.log('something went wrong' + error))

module.exports = redisClient