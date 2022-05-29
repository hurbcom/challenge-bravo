const Mongoose = require('mongoose');
const model = require('../model')


/**
 * Estabelecer a conexão com mongo
 * @param {URL<String>} url String de conexão com o mongo
 * @author Fellipe Maia
 * @returns Promise da conexão || caso falhe o error é redisparado 
 */
module.exports.start = (url) => {
    return Mongoose.connect(url)
        .then(mongo => {
            const conn = mongo.connection
            console.log(`db: ${conn.name}, host: ${conn.host}, port: ${conn.port}, Conexão efetuada com sucesso`)
        }).catch(error => {
            console.error(`Falha na conexão: ${error.message}`)
            throw error
        })
}


/**
 * Interromper a conexão de forma segura
 * @param {URL<String>} url String de conexão com o mongo
 * @author Fellipe Maia
 * @returns Promise da conexão || caso falhe o error é redisparado 
 */
module.exports.stop = ()=>{
    return Mongoose.disconnect()
        .then(()=>{
            console.log(`Conexão finalizada com mongodb`)
        })
        .catch(error=>{
            console.error(`Error ao finalizar a conexão com mongodb`)
            throw error
        })
}