const CurrenciesService = require('../services/CurrenciesService')
const Joi = require('joi');
const {currencyValidation,codeValidation} = require('../helpers/validate.currency')
const {formatResponse} = require('../../utils/format.response')

class CurrenciesController {
    async makeNewCurrency(req,res){
        /*
            #swagger.tags = ['Currency']
            #swagger.description = 'Cria uma nova moeda'
            #swagger.parameters['currency'] = {
                in: 'body',
                description: 'Moeda nova.',
                required: true,
                schema: {
                    "name":"string",
                    "code":"string",
                    "icon":"string",
                    "value":"float",
                    "fictional":"boolean"
                }
           }
            #swagger.responses[200] = {
                description: 'Moeda encontrada no banco com o código passado',
                schema: {
                    "success": true,
                    "data":
                    {
                        "id": 21,
                        "name": "Brazilian Real",
                        "code": "BRL",
                        "icon": "https://currencyfreaks.com/photos/flags/brl.png",
                        "value": 5.237,
                        "fictional": false,
                        "createdAt": "2021-05-10T11:37:58.003Z",
                        "updatedAt": "2021-05-10T12:42:14.594Z"
                    }
                }
            }
            #swagger.responses[400] = {
                description: 'Algum problema no banco',
                schema: {
                    "success": false,
                    "data": "Your currency don´t exist in our database."
                }
            }
        */

        const newCurrency = req.body
        const { error }  = currencyValidation.validate(newCurrency);

        if(error){
            res.status(400).json(formatResponse(false,error))
        }
        try {
            const freshNew = await CurrenciesService.create(newCurrency)
            res.status(200).json(formatResponse(true,freshNew))
        } catch (error) {
            res.status(400).json(formatResponse(false,error))
        }

    }

    async getCurrency(req,res){
        /*
            #swagger.tags = ['Currency']
            #swagger.description = 'Pega uma oeda especifica usando como paramentro seu código de moeda e devolve em json'
            #swagger.parameters['code'] = { description: "Codigo da moeda" }
            #swagger.responses[200] = {
                description: 'Moeda encontrada no banco com o código passado',
                schema: {
                    "success": true,
                    "data": {
                    "id": 21,
                    "name": "Brazilian Real",
                    "code": "BRL",
                    "icon": "https://currencyfreaks.com/photos/flags/brl.png",
                    "value": 5.237,
                    "fictional": false,
                    "createdAt": "2021-05-10T11:37:58.003Z",
                    "updatedAt": "2021-05-10T12:42:14.594Z"
                    }
                }
            }
            #swagger.responses[400] = {
                description: 'Algum problema no banco',
                schema: {
                    "success": false,
                    "data": "Your currency don´t exist in our database."
                }
            }
        */
        const { code }= req.params

        const { error }  = codeValidation.validate({code});

        if(error){
            res.status(400).json(formatResponse(false,error))
        }

        try {
            const currency = await CurrenciesService.findOneByCode(code)
            res.status(200).json(formatResponse(true,currency))
        } catch (error) {
            res.status(400).json(formatResponse(false,"Your currency don´t exist in our database."))
        }
    }

    async getAllCurrency(req,res){
        /*
            #swagger.tags = ['Currency']
            #swagger.description = 'Pega todas as moedas disponiveis no banco e devolve um array em json'
            #swagger.produces = ['application/json']
            #swagger.responses[200] = {
                description: 'Lista de todas as moedas encontradas',
                schema: {
                    "success": true,
                    "data": [
                        {
                            "id": 3,
                            "name": "Lek",
                            "code": "ALL",
                            "icon": "https://currencyfreaks.com/photos/flags/all.png",
                            "value": 101.086542,
                            "fictional": false,
                            "createdAt": "2021-05-10T11:37:58.002Z",
                            "updatedAt": "2021-05-10T12:43:04.689Z"
                        }
                    ]
                }
            }
            #swagger.responses[500] = {
                description: 'Algum problema no banco',
                schema: {
                    "success": false,
                    "data": "Something run bad."
                }
            }

        */
        try {
            const currencies = await CurrenciesService.findAll()
            res.status(200).json(formatResponse(true,currencies))
        } catch (error) {
            res.status(500).json(formatResponse(false,"Something run bad."))
        }
    }

    async transform(req,res){
        /*
            #swagger.tags = ['Currency']
            #swagger.parameters['from'] = { description: "Codigo da moeda de origem" }
            #swagger.parameters['to'] = { description: "Codigo da moeda destino" }
            #swagger.parameters['amount'] = { in: 'query', description: "Quantidade de moeda a ser convertida" }
            #swagger.responses[200] = {
                description: 'Moeda encontrada no banco com o código passado e convertida',
                schema: {
                    "from": {
                        "id": 21,
                        "name": "Brazilian Real",
                        "code": "BRL",
                        "icon": "https://currencyfreaks.com/photos/flags/brl.png",
                        "value": 5.237,
                        "fictional": false,
                        "createdAt": "2021-05-10T11:37:58.003Z",
                        "updatedAt": "2021-05-10T13:08:08.982Z"
                    },
                    "to": {
                        "id": 51,
                        "name": "Euro",
                        "code": "EUR",
                        "icon": "https://currencyfreaks.com/photos/flags/eur.png",
                        "value": 0.821241,
                        "fictional": false,
                        "createdAt": "2021-05-10T11:37:58.005Z",
                        "updatedAt": "2021-05-10T13:08:08.909Z"
                    },
                    "result": 3.136303227038381
                }
            }
            #swagger.responses[400] = {
                description: 'Algum problema no banco',
                schema: {
                    "success": false,
                    "data": "One of your passed currency don´t exist in our database."
                }
            }
        */
        const {from,to,amount}  = req.params
        try {
            const fromUSD           = await CurrenciesService.findOneByCode(from)
            const toUSD             = await CurrenciesService.findOneByCode(to)
            const change            = await CurrenciesService.transform(fromUSD.value,toUSD.value,amount)
            res.status(200).json(formatResponse(true,{from:fromUSD,to:toUSD, result:change}))
        } catch (error) {
            res.status(400).json(formatResponse(false,"One of your passed currency don´t exist in our database."))
        }
    }
}

module.exports = new CurrenciesController();