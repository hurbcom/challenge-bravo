const repositoryCoin = require('../repository/coin')
const redis = require('../redis/quoteCache')
const utils = require('../util')

/**
 * Buscar lista de moedas disponível no serviço
 * @param {String} type Filtrar a busca no banco
 * @returns Lista de código de moedas disponíveis no serviço
 * || Error retornado do mongodb na tentativa de remove a moeda
 * {
 *  error: false
 *  status: 200 | 201 | ...
 *  date: new Date()
 *  message: mensagem informada
 *  data: payload
 * }
 */
exports.getAll = (type) => {
    return repositoryCoin.getAllCoin(type)
        .then((result) => {
            const data = result.map((coin) => coin.coinCode)
            return utils.response('Lista de moedas', 200, data)
        })
}

/**
 * Buscar os dados da moeda pesquisada
 * @param {String} coinCode Código de moeda
 * @returns Moeda do encontrada  
 * || Error retornado de moeda não encontrada
 * || Error retornado do mongodb na tentativa de remove a moeda
 * {
 *  error: false
 *  status: 200 | 201 | ...
 *  date: new Date()
 *  message: mensagem informada
 *  data: payload
 * }
 */
exports.getCoin = (coinCode) => {
    return repositoryCoin.findOneCoin(coinCode)
        .then((coin) => {
            return utils.response('Moeda encontrada', 200, coin)
        })
}

/**
 * Salvar uma nova moeda no banco de dados
 * @param {Object} coin 
 * @author Fellipe Maia
 * @returns modelo do mongoose 
 * || Error retornado do mongodb na tentativa de salvar
 * {
 *  error: false
 *  status: 200 | 201 | ...
 *  date: new Date()
 *  message: mensagem informada
 *  data: payload
 * }
 */
exports.add = (coin) => {
    return repositoryCoin.add(coin)
        .then(() => {
            return utils.response('Moeda Salvo com sucesso', 201)
        })
}

/**
 * Atualizar os campos de uma moeda do banco de dados.
 * @param {String} coinCode BTC | BRL | EUR | ...
 * @param {Object} coin 
 * @author Fellipe Maia
 * @returns Objeto contendo se a moeda foi atualizada
 * || Error retornado de moeda não encontrada
 * || Error retornado do mongodb na tentativa de atualizar
 */
exports.update = (coinCode, coin) => {
    return repositoryCoin.update(coinCode, coin)
        .then(() => {
            return utils.response('Moeda Atualizada com sucesso', 200)
        })
}

/**
 * Remove uma moeda do banco de dados e do cache.
 * @param {String} coinCode BTC | BRL | EUR | ...
 * @author Fellipe Maia
 * @returns Objeto contendo se a moeda foi removida
 * || Error retornado de moeda não encontrada
 * || Error retornado do mongodb na tentativa de remove a moeda
 */
exports.delete = (coinCode) => {
    return redis.register(coinCode, undefined)
        .then(() => {
            return repositoryCoin.delete(coinCode)
        }).then(() => {
            return utils.response('Moeda Removida com sucesso', 200)
        })
}