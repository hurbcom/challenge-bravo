const repositoryCoin = require('../repository/coin')
const redis = require('../redis/quoteCache')
const apiQuote = require('../api/quote')
const CONST = require('../properties')
const utils = require('../util')


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

exports.initialLoadInRedis = () => {

    const quoteAPI = __byAPI()
        .then(() => {
            console.log("Carga inicial das moedas com valor Atulizado via API")
            return "Carga inicial das moedas com valor Atulizado via API"
        }).catch((error) => {
            error.message = 'Não foi possivel da carga inicial das cotações via API: ' + error.message
            throw error
        })

    const quoteFixe = repositoryCoin.getAllCoin('FIXE')
        .then((coins) => {
            return Promise.all(coins.map((el) => {
                return redis.register(el.coinCode, { buy: el.buy, sale: el.sale })
            }))
        }).then(() => {
            console.log("Carga inicial das moedas com valor fixo")
            return "Carga inicial das moedas com valor fixo"
        }).catch((error) => {
            if (error.status == 404) return console.log("Não h com valor fixo")

            error.message = 'Não foi possivel da carga inicial das moedas com valor fixo: ' + error.message
            throw error

        })

    return Promise.all([
        quoteAPI,
        quoteFixe
    ])
}

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