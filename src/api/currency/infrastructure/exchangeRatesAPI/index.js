const axios = require('axios')

const getRates = (base, to) => {
    // return axios.get(`https://api.exchangeratesapi.io/latest?base=${base}`)
    //     .then(e => e.data['rates']) API HAS NO BTC/ETH
    return axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${base}&tsyms=${to}`)
        .then(e => e.data)
}

module.exports = ({ }) => ({
    getRates
})