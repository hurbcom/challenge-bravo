const repositoryCoin = require('../repository/coin')
const utils = require('../util')

exports.getAll = (type) => {
    return repositoryCoin.getAllCoin(type)
        .then((result) => {
            const data = result.map((coin)=> coin.coinCode)
            return utils.response('Lista de moedas', 200, data)
        })
}

exports.getCoin = (coinCode) => {
    return repositoryCoin.findOneCoin(coinCode)
        .then((coin) => {
            return utils.response('Moeda encontrada', 200, coin)
        })
}

exports.add = (coin) => {
    return repositoryCoin.add(coin)
        .then(() => {
            return utils.response('Moeda Salvo com sucesso', 201)
        })
}

exports.update = (coinCode, coin) => {
    return repositoryCoin.update(coinCode, coin)
        .then(() => {
            return utils.response('Moeda Atualizada com sucesso', 200)
        })
}

exports.delete = (coinCode) => {
    return repositoryCoin.delete(coinCode).then((re) => {
        return utils.response('Moeda Removida com sucesso', 200)
    })
}