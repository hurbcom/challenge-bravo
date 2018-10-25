
const controller = {}
const rates = require('../../services/rates')


/**
 * @description Método do controlador para o processo da requisição de conversão de moedas.
 * @author Leonardo Tozato <leo.muniztozato@gmail.com>
 * @param {Request} req
 * @param {Response} res
 */
controller.convert = (req, res) => {
    
    rates.updateRates().then(res.send({data:'sucesso'}))
}

module.exports = controller