const Mongoose = require('mongoose')
const { models } = Mongoose

exports.add = async (coin) => {
    try {
        const coinModel = new models.CoinModel(coin)
        return Promise.resolve(await coinModel.save())
    } catch (error) {
        error.message = 'Erro ao tentar salvar a moeda: ' + error.message
        return Promise.reject(new HandleError(error))
    }
}

exports.update = (coinCode, coin) => {
    const query = { coinCode: coinCode }
    return this.findOneCoin(coinCode)
        .then(() => {
            return models.CoinModel.updateOne(query, coin)
        })
}

exports.updateQuoteValue = (quote) => {
    const coinCode = quote.coinCode
    const coin = { quote: { 'sale': quote.sale, 'buy': quote.buy } }
    return this.update(coinCode, coin)
}

exports.delete = (coinCode) => {
    const query = { coinCode: coinCode }
    return this.findOneCoin(coinCode)
        .then(() => {
            return models.CoinModel.deleteOne(query)
        })
}

exports.findOneCoin = (coinCode) => {
    const query = { coinCode: coinCode }
    const project = { _id: 0, __v: 0 }
    return models.CoinModel.findOne(query, project)
        .then((coinModel) => {
            if (!coinModel) {
                const data = { coinCode: coinCode }
                throw new HandleError('Moeda não encontrada', 404, data)
            }
            return coinModel
        })
}

exports.getAllCoin = (type) => {
    const query = type ? { type: type } : {}
    const project = { _id: 0, __v: 0 }
    return models.CoinModel.find(query, project)
        .then((coins) => {
            if (!coins || coins?.length <= 0) {
                throw new HandleError('Moeda não encontrada', 404, query)
            }
            return coins
        })
}