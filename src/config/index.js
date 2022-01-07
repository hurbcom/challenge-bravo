const {
    NODE_ENV,
    PORT,
    LOGGER_LEVEL,
    DB_MONGODB_NAME_TEST,
    DB_MONGODB_NAME,
    DB_MONGODB_DOMAIN,
    ECONOMY_API
} = process.env

const IS_TEST = NODE_ENV === 'test'

const dataBaseName = {
    test: DB_MONGODB_NAME_TEST,
    development: DB_MONGODB_NAME
}[NODE_ENV]

const dataBaseUrl = `${DB_MONGODB_DOMAIN}/${dataBaseName}`

const dataBaseConfig = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

export {
    IS_TEST,
    LOGGER_LEVEL,
    PORT,
    dataBaseConfig,
    dataBaseUrl,
    ECONOMY_API
}
