const app = require('../src/app')
const redisConnection = require('../src/redis/connection')
const mongoConnection = require('../src/repository/connection')
const { initialLoadInRedis } = require('../src/controller/updateQuotation')
const CONST = require('../src/properties')
global.HandleError = require('../src/util/HandleError')

Promise.all([
    mongoConnection.start(CONST.MONGODB_URL),
    redisConnection.start(CONST.REDIS_URL)
])
    .then(() => {
        return initialLoadInRedis()
    })
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

async function callbackStopSystem() {
    await stopServer().then(() => {
        console.log(`Serviço finalizado com sucesso`)
        process.exit(CONST.EXIT_STATUS.Success)
    }).catch((err) => {
        console.error(`Error ao tentar finalizar o sistema: ${err.message}`)
        process.exit(CONST.EXIT_STATUS.Failure)
    })
}


function stopServer() {
    return app.stop()
        .then(() => {
            return Promise.all([
                redisConnection.stop(),
                mongoConnection.stop()
            ])
        }).catch(error => {
            console.error('Error durante a finalização do Express.')
            console.error(error.message)
            console.error(error)
            process.exit(CONST.EXIT_STATUS.Failure)
        })
}

