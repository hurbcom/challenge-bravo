const repositoryCoin = require('../repository/coin')
const redis = require('../redis/quoteCache')
const apiQuote = require('../api/quote')
const CONST = require('../properties')
const utils = require('../util')

/**
 * Inicia a atualização quando recebido um evento do cronjob
 * @author Fellipe Maia
 * @returns Objeto response estruturado 
 * || Error retornado de moeda não encontrada
 * || Error retornado do mongodb, api ou redis
 */
exports.byAPI = () => {
    return __byAPI().then((result) => {
        if (!result || result?.length <= 0) {
            throw new HandleError('Moeda não encontrada', 404)
        }

        console.log('Cotação atualizada no redis')
        const response = utils.response('Cotação atualizada', 200)
        return response
    })
}


/**
 * Responsável por buscar as moedas do tipo API e busca na api e grava no banco de cache
 * @author Fellipe Maia 
 * @returns Quando sucesso retorna uma lista de 'OK' 
 * || Error retornado pelo mongo, api e cache 
 */
function __byAPI() {
    return repositoryCoin.getAllCoin('API')
        .then((coins) => {
            if (!coins || coins?.length <= 0) return []

            coins = coins.map((el) => `${el.coinCode}-${CONST.BASE_COIN}`)
            return apiQuote.getQuoteUpdated(coins)
        })
        .then((apiReturn) => {
            return Promise.all(
                apiReturn.map((quote) => {
                    return repositoryCoin.updateQuoteValue(quote)
                })
            ).then(() => {
                return Promise.all(apiReturn.map((el) => {
                    return redis.register(el.coinCode, { buy: el.buy, sale: el.sale })
                }))
            })
        })
}


/**
 * Atualiza a cotação na inicialização so servidor  
 * @author Fellipe Maia
 * @returns Quando sucesso retorna uma mensagem de texto.
 */
exports.initialLoadInRedis = () => {

    function response(promise, type){
        return promise.then((result) => {
            let message = `Carga inicial das moedas do typo ${type} no banco de cache`

            if (!result || result?.length <= 0) {
                message = `Não há moeda do tipo ${type} para carregar no banco de cache`
            }

            console.log(message)
            return message
            
        }).catch((error) => {
            error.message = `Error ao da carga inicial das cotações do tipo ${type}: ${error.message}`
            throw error
        })
    }

    const quoteAPI = __byAPI()
        
    const quoteFixe = repositoryCoin.getAllCoin('FIXE')
        .then((coins) => {
            return Promise.all(coins.map((el) => {
                return redis.register(el.coinCode, { buy: el.quote?.buy, sale: el.quote?.sale })
            }))
        })

    return Promise.allSettled([
        response( quoteAPI, 'api'),
        response( quoteFixe, 'fixe'),
    ])
}


/**
 * Atualiza a cotação de forma manual 
 * @param {Object} quote Objeto contendo API
 * @author Fellipe Maia
 * @returns  Quando sucesso retorna uma lista de 'OK' 
 * || Error retornado de moeda não encontrada
 * || Error retornado do mongodb ou redis
 */
exports.manual = (quote) => {
    return repositoryCoin.updateQuoteValue(quote)
        .then(() => {
            return redis.register(quote.coinCode, {
                buy: quote.buy, sale: quote.sale
            })
        }).then(() => {
            console.log('Cotação atualizada manualmente')
            const response = utils.response('Cotação atualizada manualmente', 200)
            return response
        })
}