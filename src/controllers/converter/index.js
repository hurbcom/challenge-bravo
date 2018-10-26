
const controller = {}
const ratesService = require('../../services/rates')
const converterService = require('../../services/converter')

/**
 * @description Função do controlador para o processo da requisição de conversão de moedas.
 * @author Leonardo Tozato <leo.muniztozato@gmail.com>
 * @param {Request} req
 * @param {Response} res
 */
controller.convert = (req, res) => {
    try{
        let reqParams = { ...req.query }
        let requiredParams = ['from', 'to', 'amount']

        // Checa se estiver parâmetros faltando
        let missingParams = requiredParams.reduce((prev, curr) => {
            if(!reqParams[curr]) {
                return prev + `${prev != '' ? ',' : ''}` + curr
            }
            return ''
        },'')
        
        if(missingParams){
            res.status(400).send({error: `Required params "from", "to" and "amount". Missing params ${missingParams}.`})
            return
        }

        // Checa se a quantidade é numérica 
        if(isNaN(reqParams.amount)){
            res.status(400).send({ error: `Request param "amount" need to be number` })
            return
        }

        //Checa se as moedas passadas são válidas e cobertas pela API 
        reqParams.from = reqParams.from.toUpperCase()
        reqParams.to = reqParams.to.toUpperCase()
        if (!ratesService.currencies.some(currency => currency === reqParams.from)) {
            res.status(401).send({ error: `Invalid currency in request param "from". Currencies currently accepted: ${ratesService.currencies.toString()}` })
            return
        }
        
        if(!ratesService.currencies.some(currency => currency === reqParams.to)) {
            res.status(401).send({ error: `Invalid currency in request param "to". Currencies currently accepted: ${ratesService.currencies.toString()}` })
            return
        }

        converterService.currencyConvert(reqParams.from, reqParams.to, reqParams.amount)
            .then(result => 
                res.send({ ...reqParams, result })
            )
            .catch(err => {
                console.log(error)
                throw error   
            });
    }
    catch(err){
        console.log(err)
        res.status(500).send({error: `Internal server error.`})
    }
}

module.exports = controller