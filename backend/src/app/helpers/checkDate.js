const CurrenciesService = require('../services/CurrenciesService')
const IntegrationController = require('../controllers/IntegrationController')

const checkValidLifeCicle = async (req,res,next)=>{
    try {
        const unHealthy = await CurrenciesService.getHealthInfo()
        if(unHealthy){
            await IntegrationController.getCurrencies()
        }
        next()
    } catch (error) {
        return false
    }
}

module.exports = checkValidLifeCicle