exports.PORT = process.env.PORT || 3000
exports.ENV = process.env.ENV || 'DEV'
exports.DATABASE_URI = 'mongodb://db:27017/challenge-bravo'
exports.AWESOMEAPI_URI = 'https://economia.awesomeapi.com.br'
exports.AWESOMEAPI_ENDPOINT_LAST = '/last'

exports.BASE_COIN = process.env.BASE_COIN || 'USD'
exports.COINS = process.env.COINS || ['BRL', 'EUR', 'BTC', 'ETH']
