import { exchangeRatesRepository } from '../repositories/exchangeRatesRepository.js'

async function convert(from, to, amount) {
    const exchange = await exchangeRatesRepository.getRatesPair(from, to)

    const conversion = (exchange.from.rate*amount) / exchange.to.rate
    return `${amount} ${from} worth ${conversion} ${to}`
}

export const exchangeService = {
    convert
}
