const axios = require('axios')

const getRates = (base) => {
    return axios.get(`https://api.exchangeratesapi.io/latest?base=${base}`)
        .then(e => e.data['rates'])
}

module.exports = ({ }) => ({
    getRates
})