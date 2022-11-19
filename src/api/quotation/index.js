const axios = require('axios')
const { AWESOMEAPI_URI, AWESOMEAPI_ENDPOINT_LAST } = require('../../properties')

exports.getLastQuotation = (from, to) => {
	const params = {
		method: 'GET',
		url: `${AWESOMEAPI_URI}${AWESOMEAPI_ENDPOINT_LAST / from - to}`,
	}

	console.log(params)
	return axios(params)
		.then((res) => {
			console.log(res)
		})
		.catch((err) => {
			console.log(err.message)
		})
}
