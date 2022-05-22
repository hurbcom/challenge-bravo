const { createClient } = require('redis')
const CONST = require('../properties')

//fonte de consulta para a função retryStrategy https://www.tutorialspoint.com/node-js-retry-strategy-property-in-redis
function retryStrategy(options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
        // If redis refuses the connection or is not able to connect
        return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnection after the specified time limit
        return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
        // End reconnecting with built in error
        return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
}

exports.startConnection = (url) => {
    global.client = createClient({
        url: url,
        retry_strategy: retryStrategy,
        expire: CONST.REDIS_CACHE_EXPIRE
    })

    return client.connect().then(() => {
        console.log('Conexão efetuado com sucesso no redis - url: ' + url)
    }).catch(error => {
        console.error('Error ao iniciar conexão com redis')
        throw error
    })
}

exports.closeConnection = () => {
    if (client == null) {
        console.log('Conexão Inesistente com redis')
        return Promise.resolve(true)
    }
    return global.client.disconnect().then(() => {
        console.log('Conexão finalizado com sucesso no redis')
    }).catch(error => {
        console.error('Error ao finalizar a conexão com redis')
        throw error
    })
}
