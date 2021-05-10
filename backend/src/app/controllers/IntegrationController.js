const IntegrationService = require('../services/IntegrationService')

class IntegrationController {
    // rotina para atualizar os dados do servidor sem necessidade de ficar indo na API todas as vezes
    async getCurrencies(req,res){
        try {
            const currencies = await IntegrationService.getCurrencies()
            const amount = await IntegrationService.populate(currencies.data)
            const values = await IntegrationService.getCurrenciesValues()
            const populado = await IntegrationService.populateValues(values)

            Promise.all([currencies, amount, values,populado]).then(() => {
            });
        } catch (error) {
            return Promise.reject(new Error(false))
        }
        return Promise.resolve(true)
    }

}

module.exports = new IntegrationController();