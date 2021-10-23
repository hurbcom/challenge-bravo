'use strict'

class CurrencyController {
    async getAllSupportedCurrencies(res){
        res.status(200).send()
    }

    async getConversion(req, res){
        res.status(200).send()
    }

    async addCurrency(req, res){
        res.status(200).send()
    }

    async deleteCurrency(req, res){
        res.status(200).send()
    }
}

module.exports = CurrencyController