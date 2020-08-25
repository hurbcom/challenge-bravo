module.exports = ({
    ratesAPI,
    redisClient,
    logger
}) => {
    const convert = async (from, to, amount) => {
        let rates
        return new Promise((resolve, reject) => {
            redisClient.get(`RATES_VALUE_${to.abbreviation}`, async (err, data) => {
                if (err) throw err
                if (data) {
                    rates = JSON.parse(data)
                }
                else {
                    rates = await ratesAPI.getRates(from.abbreviation, to.abbreviation)
                    redisClient.set(`RATES_VALUE_${to.abbreviation}`, JSON.stringify(rates))
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