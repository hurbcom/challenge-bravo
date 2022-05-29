const app = require('../src/app')
const redisConnection = require('../src/redis/connection')
const CONST = require('../src/properties')
global.HandleError = require('../src/util/HandleError')


/**
 * Iniciar o serviço de cotação
 * @author Fellipe Maia
 */
function startServer() {
    return redisConnection.start(CONST.REDIS_URL)
        .then(() => {
            return app.start(CONST.PORT, CONST.ENV)
        }).then(() => {
            return mapEventCloseSystem()
        }).catch(error => {
            console.error('Error durante a inicialização do sistema.')
            console.error(error.message)
            console.error(error)
            process.exit(CONST.EXIT_STATUS.Failure)
        })
}

/**
 * Criar a monitoria dos eventos de fechamento de processo
 * passando como callback a função callbackStopSystem
 * @author Fellipe Maia
 * @returns Promise com sucesso casos eventos seja criado
 * || Promise com falha casos ocorra falha na criação dos eventos
 */
function mapEventCloseSystem() {
    try {
        CONST.EXIT_SIGNALS.forEach((sig) => {
            process.on(sig, callbackStopSystem)
        })
        return Promise.resolve(true)
    } catch (error) {
        return Promise.reject(error)
    }
}


/**
 * Callback responsável a função stopServer para finalizar o servidor
 * @author Fellipe Maia
 */
async function callbackStopSystem() {
    await stopServer().then(() => {
        console.log(`Serviço finalizado com sucesso`)
        process.exit(CONST.EXIT_STATUS.Success)
    }).catch((err) => {
        console.error(`Error ao tentar finalizar o sistema: ${err.message}`)
        process.exit(CONST.EXIT_STATUS.Failure)
    })
}

/**
 * Responsável por desconectar os serviços utilizados para que não ocorra perda de informação
 * @author Fellipe Maia
 * @returns Promise com sucesso casos os serviços seja desconectados
 * || Promise com falha casos ocorra falha na desconexão os serviços 
 */
function stopServer() {
    return app.stop()
        .then(() => {
            return redisConnection.stop()
        }).catch(error => {
            console.error('Error durante a finalização do Express.')
            console.error(error.message)
            console.error(error)
            process.exit(CONST.EXIT_STATUS.Failure)
        })
}


startServer()