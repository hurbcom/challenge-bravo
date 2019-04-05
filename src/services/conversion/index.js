const conversion = {}
const redisClient = require('../../config/redis')

/**
 * @description Recupera as cotações do Redis e executa a conversão
 * @author Mateus Schenatto <mateus.sche@gmail.com>
 * @param {String} from
 * @param {String} to
 * @param {Number} amount
 * @returns {Number}
 */
conversion.currency = async (from, to, amount) => {
    let [rateFrom, rateTo] = await redisClient.mget([from, to])

    return amount * rateTo / rateFrom
}

module.exports = conversion