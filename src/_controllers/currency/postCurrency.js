const makePostCurrency = ({ errorMessages, addCurrency }) => {
	return async function postCurrency(httpRequest, myCache) {
		try {
			const {
				currency
			} = httpRequest.body

			const { ip, headers, source = {} } = httpRequest
			source.ip = ip
			source.browser = headers["User-Agent"]
			if (headers["Referer"]) {
				source.referer = headers["Referer"]
			}

			const supportedCurrencies = await addCurrency({ currency, myCache })

			return {
                status: 'success',
				statusCode: 200,
				body: supportedCurrencies
			}

		}
		catch (err) {
			const { status, body } = errorMessages[err.message] || { status: 400, body: err.message }
			return {
				headers: {
					"Content-Type": "application/json",
				},
				statusCode: status,
				body: {
					error: body,
				}
			}
		}
	}
}

module.exports = makePostCurrency;