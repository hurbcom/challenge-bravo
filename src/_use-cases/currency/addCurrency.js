const CACHE_KEY = 'supported-currencies'

const makeAddCurrency = ({ }) => {
    return async function addCurrency({ currency, myCache }) {
        let supportedCurrencies = myCache.get(CACHE_KEY)
        if (supportedCurrencies.includes(currency)) {
            throw new Error('DUPLICATED_CURRENCY')
        }

        supportedCurrencies.push(currency)
        myCache.set(CACHE_KEY, supportedCurrencies)
        return supportedCurrencies
    }
}

module.exports = makeAddCurrency