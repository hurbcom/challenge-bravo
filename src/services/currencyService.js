import logger from '../config/logger.js'
import { RequestError } from '../errors/RequestError.js'
import * as currencyRepository from '../repositories/currencyRepository.js'
import { updateCurrancyValues } from '../utils/updateCurrencyValue.js'

const getAllCurrency = async () => {
    try {
        logger.info('[CURRENCY SERVICE] Process to get all currencies')

        const currencies = await currencyRepository.getAll()

        return currencies
    } catch (error) {
        logger.error(`[CURRENCY SERVICE] Error >> ${JSON.stringify(error)}`)

        throw error
    }
}

const createCurrency = async (currencyDatas) => {
    try {
        logger.info('[CURRENCY SERVICE] Process to save new currency')

        const response = await currencyRepository.create(currencyDatas)

        return response
    } catch (error) {
        logger.error(`[CURRENCY SERVICE] Error >> ${JSON.stringify(error)}`)

        throw error
    }
}

const convertCurrency = async ({ currencyFrom, currencyTo, amount }) => {
    logger.info(
        `[CURRENCY SERVICE] Process to convert currency from ${currencyFrom} to ${currencyTo}`
    )

    try {
        const currencyFromDatas = await currencyRepository.getByCode(currencyFrom)
        const currencyToDatas = await currencyRepository.getByCode(currencyTo)

        if (!currencyFromDatas || !currencyToDatas) { throw new RequestError('Currency not created in database') }

        const {
            currencyFromInDollar,
            currencyToInDollar
        } = await updateCurrancyValues(currencyFromDatas, currencyToDatas)

        const amountInDollar = parseFloat(amount) * currencyFromInDollar

        const newValue = amountInDollar / currencyToInDollar

        const response = {
            from: currencyFrom,
            to: currencyTo,
            convertedAmount: `$ ${newValue.toFixed(2)} ${currencyTo}`
        }

        logger.debug(`[CURRENCY SERVICE] Response > ${JSON.stringify(response)}`)

        return response
    } catch (error) {
        logger.error(`[CURRENCY SERVICE] Error >> ${JSON.stringify(error)}`)

        throw error
    }
}

const deleteCurrency = async (currencyCode) => {
    try {
        logger.info('[CURRENCY SERVICE] Process to delete one currency')

        const response = await currencyRepository.deleteByCode(currencyCode)

        return response
    } catch (error) {
        logger.error(`[CURRENCY SERVICE] Error >> ${JSON.stringify(error)}`)

        throw error
    }
}

export {
    getAllCurrency,
    createCurrency,
    deleteCurrency,
    convertCurrency
}
