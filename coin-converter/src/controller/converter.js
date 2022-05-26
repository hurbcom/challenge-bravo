const utils = require('../util')
const redis = require('../redis/quoteCache')
const factoryCalculate = require('../factory/calculate')

exports.calculate = (requestValue) => {

    const { from, to, value, type } = requestValue

    const getQuoteRedis = (coinCode, type) => {
        return redis.read(coinCode)
            .then(valueRedis => {
                if(!valueRedis) throw new HandleError("Moeda não disponivel para conversão" ,404, {coinCode: coinCode})
                let quoteValue = valueRedis[type]
                quoteValue = utils.convertNumber(quoteValue)
                return quoteValue
            })
    }

    return Promise.all([
        getQuoteRedis(from, type),
        getQuoteRedis(to, type)
    ])
        .then(quotations => {
            const quoteFrom = quotations[0]
            const quoteTo = quotations[1]
            const valueCalculate = factoryCalculate.conversion(quoteFrom, value, quoteTo)
            const data = { quoteFrom, quoteTo, valueCalculate, type }
            return utils.response("Calculado com sucesso", 200, data)
        })
}