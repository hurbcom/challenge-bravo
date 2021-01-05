const CACHE_KEY = 'supported-currencies'

const makeRemoveCurrency = ({ }) => {
    return async function removeCurrency({ currency, myCache }) {
        let supportedCurrencies = myCache.get(CACHE_KEY)
        newSupportedCurrencies = supportedCurrencies.filter(curr => curr !== currency)
        if (newSupportedCurrencies.length === supportedCurrencies.length) {
            throw new Error('CURRENCY_DOES_NOT_EXIST')
        }
        myCache.set(CACHE_KEY, newSupportedCurrencies)
        return newSupportedCurrencies
    }
}

module.exports = makeRemoveCurrency