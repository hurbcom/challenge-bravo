const axios = require('axios')

module.exports = async function getCoins() {
    const ratesApi = axios.create({
        baseURL: 'https://economia.awesomeapi.com.br',

        timeout: 1000,
    })
    const { data } = await ratesApi.get('/json/all') //requisição get na API

    return data
}
