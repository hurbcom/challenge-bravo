const CONST = require('../properties')

/**
 * Gravar no redis
 * @param {String} key Chave utilizada para gravar o valor no redis
 * @param {*} value Valor a ser registrado no redis
 * @author Fellipe Maia
 * @returns secesso retorna 'OK' em caso de falha retorna Error
 */
exports.register = (key, value) => {

    return global.client.set(key, JSON.stringify(value), { EX: CONST.REDIS_CACHE_EXPIRE})

}