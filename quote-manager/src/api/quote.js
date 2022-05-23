const axios = require('axios')
const CONST = require('../properties')

exports.getQuoteUpdated = (coins) =>{
    const url = `${CONST.API_QUOTE_URL}${CONST.API_QUOTE_LAST_PATH}${coins.join(',')}`

    return axios.get(url).then(res => {
        const data = res.data

        const quotes = coins.map((coin)=> {
            coin = coin.replace('-','')
            return {
                coinCode: data[coin].code,
                buy: data[coin].bid,
                sale: data[coin].ask,
            }
        })
        return quotes

    }).catch(error=>{
        const data = error.response?.data
        const status = error.response?.status
        throw new HandleError(error.message,status,data)
    })
}