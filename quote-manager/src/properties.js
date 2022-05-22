function convertNumber(value,defaultValue=null){
    if(!value) return defaultValue
    const num = Number(value)
    return isNaN(num)? defaultValue : num
}

exports.ENV = process.env.ENVIRONMENT || "DEV"
exports.PORT = process.env.PORT || 3001
exports.REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379"
exports.REDIS_CACHE_EXPIRE = convertNumber(process.env.REDIS_CACHE_EXPIRE)
exports.MONGODB_URL = process.env.MONGODB_URL || "mongo://localhost:27017/quote-manager"
exports.API_QUOTE_URL = process.env.API_QUOTE_URL || "https://economia.awesomeapi.com.br"
exports.API_QUOTE_LAST_PATH = process.env.API_QUOTE_LAST_PATH || "/last/"

exports.EXIT_STATUS = { Failure: 1, Success: 0 }
exports.EXIT_SIGNALS = ['SIGINT', 'SIGTERM', 'SIGQUIT']
