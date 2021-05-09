const CurrenciesService = require('../services/CurrenciesService')

class CurrenciesController {
    // pega quanto da moeda precisa para comprar 1 dolar
    async getCurrency(req,res){
        const { code }= req.params
        try {
            const currency = await CurrenciesService.findOneByCode(code)
            res.status(200).json({'success':true,data:currency})
        } catch (error) {
            res.status(400).json({'success':false,data:"Your currency don´t exist in our database"})
        }
    }

    // pega todas as moedas
    async getAllCurrency(req,res){
        try {
            const currencies = await CurrenciesService.findAll()
            res.status(200).json({'success':true, data:currencies})
        } catch (error) {
            res.status(500).json({'success':false, data:"Something run bad."})
        }
    }

    async transform(req,res){
        const {from,to,amount}  = req.params
        try {
            const fromUSD           = await CurrenciesService.findOneByCode(from)
            const toUSD             = await CurrenciesService.findOneByCode(to)
            const change            = await CurrenciesService.transform(fromUSD.value,toUSD.value,amount)
            res.json({from:fromUSD,to:toUSD, result:change}).status(200)
        } catch (error) {
            res.status(400).json({'success':false, error})
        }
    }
}

module.exports = new CurrenciesController();