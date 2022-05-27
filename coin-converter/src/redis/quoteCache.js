
/**
 * Buscar registro no redis
 * @param {String} key Chave utilizada para buscar valor no redis
 * @author Fellipe Maia
 * @returns Valor retornado do redis, caso não tenha retorna null
 */
exports.read = (key) => {
    return global.client.get(key).then(valueRedis => {
        return JSON.parse(valueRedis)
    })
}