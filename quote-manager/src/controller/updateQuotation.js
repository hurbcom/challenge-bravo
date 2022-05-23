const repositoryCoin = require('../repository/coin')
const redis = require('../redis/quoteCache')
const apiQuote = require('../api/quote')
const CONST = require('../properties')


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
            })
        }).catch((error) => {
            console.log(error);
        })
}

exports.manual = (quote) => {
    return repositoryCoin.updateQuoteValue(quote)
        .then(() => {
            return redis.register(quote.coinCode, { 
                buy: quote.buy, sale: quote.sale 
            })
        })
}