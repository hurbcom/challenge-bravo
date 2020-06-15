const axios = require('axios')

module.exports = async function getCoins() {
    const ratesApi = axios.create({
        baseURL: 'https://api.ratesapi.io/api/',
        timeout: 1000,
    })
    const { data } = await ratesApi.get('/latest?base=USD')

    return data
}
