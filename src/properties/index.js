exports.PORT = process.env.PORT || 3000
exports.ENV = process.env.ENV || 'DEV'

exports.DATABASE_URI = 'mongodb://db:27017/challenge-bravo'

exports.AWESOMEAPI_URI = 'https://economia.awesomeapi.com.br'
exports.AWESOMEAPI_ENDPOINT_LAST = '/last'

exports.BASE_COIN = process.env.BASE_COIN || 'USD'
exports.COINS = process.env.COINS || ['BRL', 'EUR', 'BTC', 'ETH']

exports.REDIS_HOST = process.env.REDIS_HOST || 'cache'
exports.REDIS_PORT = process.env.REDIS_PORT || 6379
exports.REDIS_URI = `redis://${this.REDIS_HOST}:${this.REDIS_PORT}`
