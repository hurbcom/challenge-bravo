import logger from '../config/logger.js'
import * as currencyService from '../services/currencyService.js'
import currencySchema from '../validators/currencySchema.js'
import conversionSchema from '../validators/conversionSchema.js'

const getAllCurrency = async (req, res) => {
    try {
        logger.info('[CURRENCY CONTROLLER] Initializing to get all currency')

        const response = await currencyService.getAllCurrency()

        res.json(response)
    } catch (error) {
        logger.error(`[CURRENCY CONTROLLER] Error >> ${JSON.stringify(error)}`)

        const statusCode = error.statusCode || 409

        res.status(statusCode).json({ error: error.message })
    }
}

const createCurrency = async (req, res) => {
    try {
        logger.info('[CURRENCY CONTROLLER] Initializing to save new currency')

        const body = req.body

        await currencySchema.validate(body)

        const response = await currencyService.createCurrency(body)

        res.json(response)
    } catch (error) {
        logger.error(`[CURRENCY CONTROLLER] Error >> ${JSON.stringify(error)}`)

        const statusCode = error.statusCode || 409

        res.status(statusCode).json({ error: error.message })
    }
}

const deleteCurrency = async (req, res) => {
    try {
        logger.info('[CURRENCY CONTROLLER] Initializing to delete one currency')

        const currencyCode = req.params.currencyCode

        const response = await currencyService.deleteCurrency(currencyCode)

        res.json(response)
    } catch (error) {
        logger.error(`[CURRENCY CONTROLLER] Error >> ${JSON.stringify(error)}`)

        const statusCode = error.statusCode || 409

        res.status(statusCode).json({ error: error.message })
    }
}

const convertCurrency = async (req, res) => {
    try {
        logger.info('[CURRENCY CONTROLLER] Initializing to convert currency')

        const query = req.query

        await conversionSchema.validate(query)

        const conversionJson = {
            currencyFrom: query.from,
            currencyTo: query.to,
            amount: query.amount
        }

        const response = await currencyService.convertCurrency(conversionJson)

        res.json(response)
    } catch (error) {
        logger.error(`[CURRENCY CONTROLLER] Error >> ${JSON.stringify(error)}`)

        const statusCode = error.statusCode || 409

        res.status(statusCode).json({ error: error.message })
    }
}

export {
    getAllCurrency,
    createCurrency,
    deleteCurrency,
    convertCurrency
}
