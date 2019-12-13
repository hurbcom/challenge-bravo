const axios = require('axios')

module.exports = {
    convert(from, to) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`, {headers: { Authorization: `Apikey a202ca89a126eac2f2a7279079d43c73c4523cbdfd4d12432d8cb66570cdd7a8`}})   
                resolve(Object.values(response.data))
            } catch (error) {
                reject(error)
            }
            
        })
    }
}