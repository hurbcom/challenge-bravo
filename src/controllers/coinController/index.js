const controller = {}
const validator = require('./../../helpers/validators');
const convertService = require('./../../services/conversion')
const ratesService = require('./../../services/rates')

/**
 * @description Controlador para executar a requisição de conversão de moedas
 * @author Mateus Schenatto <mateus.sche@gmail.com>
 * @param {Request} req
 * @param {Response} res
 */
controller.convert = (req, res) => {
    try {
        let reqParams = {
            ...req.query
        }
        let requiredParams = ['from', 'to', 'amount']

        const validateParams = validator.missingParams(requiredParams, reqParams)

        if (validateParams) {
            res.status(400).send({
                error: `Parametros obrigatorios "from", "to" and "amount". Faltou os parametros ${validateParams}.`
            })
            return
        }

        if (isNaN(reqParams.amount)) {
            res.status(400).send({
                error: `Parametro "amount" precisa ser númerico`
            })
            return
        }

        const validateMoedas = validator.validateCurrencies(reqParams.from, reqParams.to)

        if (validateMoedas) {
            res.status(400).send({
                error: validateMoedas
            })
            return
        }

        convertService.currency(reqParams.from, reqParams.to, reqParams.amount)
            .then(result =>
                res.send({
                    ...reqParams,
                    result
                })
            )
            .catch(err => {
                console.log(err)
                throw err
            });

    } catch (err) {
        res.status(500).send({
            error: `Internal server error.`
        })
    }
}

module.exports = controller