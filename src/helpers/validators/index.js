const ratesService = require('./../../services/rates')
const validator = {}

/**
 * @description Validando parametros da requisição
 * @author Mateus Schenatto <mateus.sche@gmail.com>
 * @param requiredParams Parametros obrigatórios
 * @param reqParams Parametros da requisição
 * @returns {String} Caso seja válido retorna uma string vazia, caso contrário retorna os parametros que precisam
 */
validator.missingParams = (requiredParams, reqParams) =>
    requiredParams.reduce((prev, current) => {
        if (!reqParams[current]) {
            return prev + `${prev != '' ? ',' : ''}` + current
        }
        return ''
    }, '')

/**
 * @description Validando moedas de conversão solicitadas
 * @author Mateus Schenatto <mateus.sche@gmail.com>
 * @param from Moeda de origem da conversão
 * @param to Moeda de destino da conversão
 * @returns {String} Caso seja válido retorna uma string vazia, caso contrário retornara o erro encontrado
 */
validator.validateCurrencies = (from, to) => {
    if (ratesService.currencies.some(currency => currency !== from.toUpperCase())) {
        return `Moeda de origem "from". Aceitamos apenas conversões das seguintes moedas: ${ratesService.currencies.toString()}`
    }

    if (ratesService.currencies.some(currency => currency !== to.toUpperCase())) {
        return `Moeda de destino "to". Aceitamos apenas conversões das seguintes moedas: ${ratesService.currencies.toString()}`
    }

    return ''
}

module.exports = validator;