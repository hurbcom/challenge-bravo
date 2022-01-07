import Currency from '../models/currency.js'
import logger from '../config/logger.js'
import { RequestError } from '../errors/RequestError.js'

const getAll = async () => {
    try {
        logger.info('[CURRANCY REPOSITORY] Getting all currencies')

        const currencies = await Currency.find({}).lean().exec()

        return currencies
    } catch (error) {
        logger.error(
            `[CURRANCY REPOSITORY] Error to getting all currencies >> ${JSON.stringify(error)}`
        )

        throw new RequestError()
    }
}

const getByCode = async (currencyCode) => {
    try {
        logger.info(`[CURRANCY REPOSITORY] Getting currency by code: ${currencyCode}`)

        const query = { code: currencyCode }

        const currency = await Currency.findOne(query).lean().exec()

        return currency
    } catch (error) {
        logger.error(
            `[CURRANCY REPOSITORY] Error to getting a currency >> ${JSON.stringify(error)}`
        )

        throw new RequestError()
    }
}

const create = async (currencyDatas) => {
    try {
        logger.info('[CURRANCY REPOSITORY] Creating currency in database')

        const currency = await Currency(currencyDatas)

        const response = await currency.save()

        logger.debug(`[CURRANCY REPOSITORY] Currency created with id: ${currency._id}`)

        return response
    } catch (error) {
        logger.error(`[CURRANCY REPOSITORY] Error to creating currency >> ${JSON.stringify(error)}`)

        throw new RequestError()
    }
}

const update = async (currencyCode, newValueInDollar) => {
    try {
        logger.info('[CURRANCY REPOSITORY] Updating currency in database')
        logger.debug(
            `[CURRANCY REPOSITORY] Code: ${currencyCode} and new value: ${newValueInDollar}`
        )

        const query = { code: currencyCode }

        const currency = await Currency.findOne(query).exec()

        currency.inDollar = newValueInDollar

        const response = await currency.save()

        logger.debug(`[CURRANCY REPOSITORY] Currency updated for value: ${currency.inDollar}`)

        return response
    } catch (error) {
        logger.error(`[CURRANCY REPOSITORY] Error to creating currency >> ${JSON.stringify(error)}`)

        throw new RequestError()
    }
}

const deleteByCode = async (currencyCode) => {
    try {
        logger.info(`[CURRANCY REPOSITORY] Delete currency by code: ${currencyCode}`)

        const query = { code: currencyCode }

        const response = await Currency.deleteOne(query).exec()

        return response
    } catch (error) {
        logger.error(`[CURRANCY REPOSITORY] Error to deleting currency >> ${JSON.stringify(error)}`)

        throw new RequestError()
    }
}

export {
    getAll,
    getByCode,
    create,
    update,
    deleteByCode
}
