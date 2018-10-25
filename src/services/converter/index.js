const converter = {}
redisClient = require('../../redis')

/**
 * @description Recupera as cotações do Redis e executa a fórmula de conversão.
 * @author Leonardo Tozato <leo.muniztozato@gmail.com>
 * @param {String} from
 * @param {String} to
 * @param {Number} amount
 * @returns {Number}
 */
converter.currencyConvert = async (from, to, amount) => {
    let [rateFrom, rateTo] = await redisClient.mget([from, to])

    return amount * rateTo / rateFrom
}

module.exports = converter