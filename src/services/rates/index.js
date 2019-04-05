const axios = require('axios')
const rates = {}
const redisClient = require('../../config/redis')

rates.currencies = ['USD', 'BRL', 'EUR', 'BTC', 'ETH']

/**
 * @description Retorna a URL para requisição da API de cotação.
 * @author Mateus Schenatto <mateus.sche@gmail.com>
 * @returns {String}
 */
const openExchangesLast = `https://openexchangerates.org/api/latest.json?app_id=${process.env.OPENEXCHANGEID}&show_alternative=true&symbols=${rates.currencies.toString()}`

/**
 * @description Função responsavel pelo load inicial das cotações e atualizar a cada 5 minutos
 * @author Mateus Schenatto <mateus.sche@gmail.com>
 */
rates.update = () => {
    updateRate()
    setInterval(() => updateRate(), 300000)
}

/**
 * @description Atualiza a cotação das moedas, persistindo através do redis.
 * @author Mateus Schenatto <mateus.sche@gmail.com>
 * @returns {Promise} 
 */
const updateRate = () => {
    axios.get(openExchangesLast)
        .then(async result => {
            let currentRates = result.data.rates
            let promises = []
            for (let key in currentRates) {
                redisClient.set(key, currentRates[key])
            }
            await Promise.all(promises)
        })
        .catch(error => {
            throw error
        })
}

module.exports = rates