module.exports = ({
    ratesAPI,
    redisClient,
    logger
}) => {
    const convert = async (from, to, amount) => {
        let rates
        return new Promise((resolve, reject) => {
            redisClient.get('RATES_VALUE', async (err, data) => {
                if (err) throw err
                if (data) {
                    logger.info('Using redis cached response for rates')
                    rates = JSON.parse(data)
                }
                else {
                    rates = await ratesAPI.getRates(from.abbreviation)
                    logger.info('Setting redis response')
                    redisClient.set('RATES_VALUE', JSON.stringify(rates))
                }

                const conversionRate = rates[to.abbreviation]

                const conversionResult = amount * conversionRate

                resolve(conversionResult)
            })
        })
    }

    return ({
        convert
    })
}