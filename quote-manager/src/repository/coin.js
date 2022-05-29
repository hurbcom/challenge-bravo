const Mongoose = require('mongoose')
const { models } = Mongoose

/**
 * Salvar uma nova moeda no mongodb
 * @param {Object} coin 
 * @author Fellipe Maia
 * @returns modelo do mongoose 
 * || Error retornado do mongodb na tentativa de salvar
 */
exports.add = async (coin) => {
    try {
        const coinModel = new models.CoinModel(coin)
        return Promise.resolve(await coinModel.save())
    } catch (error) {
        error.message = 'Erro ao tentar salvar a moeda: ' + error.message
        return Promise.reject(new HandleError(error))
    }
}

/**
 * Atualizar os campos de uma moeda do mongodb.
 * @param {String} coinCode BTC | BRL | EUR | ...
 * @param {Object} coin 
 * @author Fellipe Maia
 * @returns Objeto contendo se a moeda foi atualizada
 * || Error retornado de moeda não encontrada
 * || Error retornado do mongodb na tentativa de atualizar
 */
exports.update = (coinCode, coin) => {
    const query = { coinCode: coinCode }
    return this.findOneCoin(coinCode)
        .then(() => {
            return models.CoinModel.updateOne(query, coin)
        })
}

/**
 * Atualiza a cotação de uma moeda do mongodb.
 * Essa função aplica a função de update
 * @param {Object} quote 
 * @author Fellipe Maia
 * @returns Objeto contendo se a cotação foi atualizada
 * || Error retornado de moeda não encontrada
 * || Error retornado do mongodb na tentativa de atualizar a cotação
 */
exports.updateQuoteValue = (quote) => {
    const coinCode = quote.coinCode
    const coin = { quote: { 'sale': quote.sale, 'buy': quote.buy } }
    return this.update(coinCode, coin)
}

/**
 * Remove uma moeda do mongodb.
 * @param {String} coinCode BTC | BRL | EUR | ...
 * @author Fellipe Maia
 * @returns Objeto contendo se a moeda foi removida
 * || Error retornado de moeda não encontrada
 * || Error retornado do mongodb na tentativa de remove a moeda
 */
exports.delete = (coinCode) => {
    const query = { coinCode: coinCode }
    return this.findOneCoin(coinCode)
        .then(() => {
            return models.CoinModel.deleteOne(query)
        })
}

/**
 * Encontrar uma moeda usando código do mongodb.
 * @param {String} coinCode BTC | BRL | EUR | ...
 * @author Fellipe Maia
 * @returns modelo do mongoose da moeda pesquisada
 * || Error retornado de moeda não encontrada
 * || Error retornado do mongodb
 */
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

/**
 * Retorna todos as moedas, ou pode filtrar pelo tipo da moeda
 * @param {String} type FIXE | API
 * @author Fellipe Maia
 * @returns Promise com sucesso caso 
 * || Promise com falha caso não 
 */
exports.getAllCoin = (type) => {
    const query = type ? { type: type } : {}
    const project = { _id: 0, __v: 0 }
    return models.CoinModel.find(query, project)
}