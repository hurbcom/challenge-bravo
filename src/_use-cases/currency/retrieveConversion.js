const CACHE_KEY = 'supported-currencies'

const makeRetrieveConversion = ({ config, axios }) => {

	const checkCurrency = (data, to, from, myCache) => {

		const supportedCurrencies = myCache.get(CACHE_KEY)

		if(supportedCurrencies.includes(to) && supportedCurrencies.includes(from)){
			return data
		}

		else{
			throw new Error('CURRENCY_NOT_SUPPORTED')
		}
	}

	return async function retrieveConversion({ from, to, amount, myCache }) {
		const { data } = await axios.get(`https://api.exchangeratesapi.io/latest?base=${from}`)
		const verifiedData = checkCurrency(data.rates, to, from, myCache)

		return {
			baseNumber: amount,
			conversion: verifiedData[to] * amount
		}
	}
}

module.exports = makeRetrieveConversion