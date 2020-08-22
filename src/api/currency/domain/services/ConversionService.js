module.exports = ({
    ratesAPI
}) => {
    const convert = async (from, to, amount) => {
        const rates = await ratesAPI.getRates(from)
        const conversionRate = rates[to]

        return amount * conversionRate
    }

    return ({
        convert
    })
}