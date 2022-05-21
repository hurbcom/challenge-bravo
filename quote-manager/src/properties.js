exports.ENV = process.env.ENVIRONMENT || "DEV"
exports.PORT = process.env.PORT || 3001
exports.REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379"

exports.EXIT_STATUS = { Failure: 1, Success: 0 }
exports.EXIT_SIGNALS = ['SIGINT', 'SIGTERM', 'SIGQUIT']