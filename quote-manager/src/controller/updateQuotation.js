const repositoryCoin = require('../repository/coin')
const redis = require('../redis/quoteCache')
const apiQuote = require('../api/quote')
const CONST = require('../properties')
const utils = require('../util')


exports.byAPI = () => {
    return repositoryCoin.getAllCoin('API')
        .then((coins) => {
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
            }).then(() => {
                console.log('Cotação atualizada no redis')
                const response = utils.response('Cotação atualizada', 200)
                return response
            })
        })
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