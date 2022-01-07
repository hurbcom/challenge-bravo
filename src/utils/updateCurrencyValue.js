import axios from 'axios'
import logger from '../config/logger.js'
import { RequestError } from '../errors/RequestError.js'
import { ECONOMY_API } from '../config/index.js'
import * as currencyRepository from '../repositories/currencyRepository.js'

const updateCurrancyValues = async (currencyFromDatas, currencyToDatas) => {
    logger.info('[UPDATE CURRENCY VALUE UTILS] Update currency datas if necessary')

    const currencyFromInDollar = await verifyIfNeedUpdateCurrancyValues(currencyFromDatas)
    const currencyToInDollar = await verifyIfNeedUpdateCurrancyValues(currencyToDatas)

    return { currencyFromInDollar, currencyToInDollar }
}

const verifyIfNeedUpdateCurrancyValues = async (currencyDatas) => {
    logger.info('[UPDATE CURRENCY VALUE UTILS] Verifying is need update currency datas')

    let currencyInDollar = currencyDatas.inDollar

    const currencyIsUSD = verifyIsUSDCurrency(currencyDatas)

    if (currencyIsUSD) return currencyInDollar

    const currencyIsFiatOrFictitious = currencyDatas.isFiatOrFictitious

    const currencyTimeOut = verifyTimeout(currencyDatas)

    if (!currencyIsFiatOrFictitious && currencyTimeOut) {
        currencyInDollar = await updateCurrencyValue(currencyDatas.code)
    }

    return currencyInDollar
}

const verifyIsUSDCurrency = (currency) => {
    logger.info('[UPDATE CURRENCY VALUE UTILS] Verifying if USD code')
    const code = currency.code

    return code === 'USD'
}

const updateCurrencyValue = async (currencyCode) => {
    logger.info('[UPDATE CURRENCY VALUE UTILS] Updating currency')

    const updatedValue = await getUptadedCurrencyValue(currencyCode)

    currencyRepository.update(currencyCode, updatedValue)

    return updatedValue
}

const verifyTimeout = (currencyDatas) => {
    logger.info('[UPDATE CURRENCY VALUE UTILS] Verifying timeout')

    const lastUpdated = new Date(currencyDatas.updatedAt)
    const now = new Date()

    const diffNowAndLastUpdated = ((now - lastUpdated) / (1000 * 60))

    return diffNowAndLastUpdated >= 3
}

const requestEconomyAPi = async (currencyCode) => {
    try {
        logger.info(
            `[UPDATE CURRENCY VALUE UTILS] Requesting economy api with currrency: ${currencyCode}`
        )

        const url = ECONOMY_API + `/${currencyCode}-USD`

        logger.info(`[UPDATE CURRENCY VALUE UTILS] Request url: ${url}`)

        const response = await axios.get(url)

        return response.data
    } catch (error) {
        logger.info(`[UPDATE CURRENCY VALUE UTILS] Error to Requesteconomy api -> ${error}`)

        if (error.statusCode === 404) throw new RequestError('Currency inserted is not real')

        throw new RequestError(error.mensage)
    }
}

const getUptadedCurrencyValue = async (currencyCode) => {
    try {
        logger.info('[UPDATE CURRENCY VALUE UTILS] Getting updated value')

        const updatedCurrencyDatas = await requestEconomyAPi(currencyCode)

        const updatedValue = updatedCurrencyDatas[`${currencyCode}USD`].ask

        return parseFloat(updatedValue)
    } catch (error) {
        logger.info(`[UPDATE CURRENCY VALUE UTILS] Error to getting updated value -> ${error}`)

        throw error
    }
}

export { updateCurrancyValues }
