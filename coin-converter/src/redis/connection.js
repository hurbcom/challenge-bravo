const { createClient } = require('redis')

/**
 * Estrategia de reconexão do redis
 * @param {Object} options Parâmetros recebidos do redis
 * @author https://www.tutorialspoint.com/node-js-retry-strategy-property-in-redis
 * @returns 
 *    Sucesso: retorna o tempo para tentar a reconexão
 *    Sucesso: retorna undefined caso exceda quantidades de reconexão 
 *    Error: Caso ocorra um erro as tenta de reconexão e interrompidas
 */
function retryStrategy(options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
        return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
        return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
        return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
}

/**
 * Estabelecer a conexão com redis
 * @param {URL<String>} url String de conexão com o redis
 * @author Fellipe Maia
 * @returns Promise da conexão 
 *  caso a Estrategia de reconexão falhe o error é redisparado 
 */
exports.start = (url) => {
    global.client = createClient({
        url: url,
        retry_strategy: retryStrategy
    })

    return client.connect().then(() => {
        console.log('Conexão efetuado com sucesso no redis - url: ' + url)
    }).catch(error => {
        console.error('Error ao iniciar conexão com redis')
        throw error
    })
}

/**
 * Interromper a conexão de forma segura
 * @author Fellipe Maia
 * @returns Promise de Desconexão
 * Caso a desconexão falhe retorna error 
 */
exports.stop = () => {
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
