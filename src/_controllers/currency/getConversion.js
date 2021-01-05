const makeGetConversion = ({ errorMessages, retrieveConversion }) => {
	return async function getConversion(httpRequest, myCache) {
		try {
			const {
				from,
				to,
				amount
			} = httpRequest.query

			const { ip, headers, source = {} } = httpRequest
			source.ip = ip
			source.browser = headers["User-Agent"]
			if (headers["Referer"]) {
				source.referer = headers["Referer"]
			}

			const currencyConversion = await retrieveConversion({ from, to, amount, myCache })
			return {
				statusCode: 200,
				body: currencyConversion
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

module.exports = makeGetConversion;