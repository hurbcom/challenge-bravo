module.exports = ({
    ratesAPI
}) => {
    const convert = async (from, to, amount) => {
        const rates = await ratesAPI.getRates(from.abbreviation)
        const conversionRate = rates[to.abbreviation]

        return amount * conversionRate
    }

    return ({
        convert
    })
}