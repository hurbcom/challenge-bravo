
const {isNil, isEmpty, isError} = require('lodash')

/**
 * Verifica o tipo da variável
 * @param {any} obj Variável que se deseja descobrir o tipo
 * @author git issue do lodash (Link não encontrado) 
 * @returns Retorna o tipo da varável
 */
exports.toType = (obj) => {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

/**
 * Padroniza o response das rotas
 * @param {*} message Mensagem 
 * @param {Number} status Status code da resposta
 * @param {*} data Campo para adicionar o payload 
 * @author Fellipe Maia
 * @returns Objeto formatado com os campos 
 *      {
 *          error: false
 *          status: 200 | 201 | ...
 *          date: new Date()
 *          message: mensagem informada
 *          data: payload
 *      }
 */
exports.response = (message, status, data = null) => {
    
    return {
        error: status < 200 || status >= 300,
        status: status,
        date: new Date().toISOString(),
        message: message,
        data: isNil(data)? undefined: data
    }
} 

/**
 * Padroniza o response das rotas que retorna error
 * @param {*} message Mensagem || Error<Object>
 * @param {Number} status Status code da resposta
 * @param {*} data Campo para adicionar o payload 
 * @author Fellipe Maia
 * @returns Objeto formatado com os campos 
 *      {
 *          error: true
 *          status: 400 | 404 | 500 |...
 *          date: new Date()
 *          message: mensagem informada | mensagem do error 
 *          data: payload
 *      }
 */
exports.responseError = (err, status = 500, data = {}) =>{
    let message = err 
    if(isError(err)){
        data = {...err.data, ...data}
        data = isEmpty(data)? null: data
        status = !!err.status? err.status: status
        message = err.message
    }

    return this.response(message, status, data)
}

/**
 * Converter o texto em numero
 * @param {String} value Valor a ser convertido em numero
 * @param {*} defaultValue Valor que dever ser retornado caso não seja possível converter
 * @author Fellipe Maia
 * @returns Valor convertido || o valor definido || null 
 */
exports.convertNumber = (value, defaultValue = null) => {
    if (!value) return defaultValue
    const num = Number(value)
    return isNaN(num) ? defaultValue : num
}
