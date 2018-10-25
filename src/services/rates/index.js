const axios = require('axios');
const rates = {}
const redisClient = require('../../redis')

/**
 * @description Retorna a URL para requisição da API de cotação.
 * @author Leonardo Tozato <leo.muniztozato@gmail.com>
 * @param {String} key
 * @returns {String}
 */
const openExchangesLast = key => 
    `https://openexchangerates.org/api/latest.json?app_id=${key}&show_alternative=true&symbols=USD,BRL,EUR,BTC,ETH`

/**
 * @description Atualiza a cotação das moedas, persistindo elas através do redis.
 * @author Leonardo Tozato <leo.muniztozato@gmail.com> 
 * @returns {<Promise>}
 */
rates.updateRates = () => 
    axios.get(openExchangesLast(process.env.API_KEY))
        .then(function (res) {
            let currentRates = res.data.rates
            for(let key in currentRates){
                redisClient.set(key, currentRates[key])
            }
        })
        .catch(function (error) {
            throw error
        })


module.exports = rates