let CacheClass = require('./cache')

class Converter {

    constructor(){
        this.cache = new CacheClass()
    }

    CurrencyToUSD(currency,currency_value){
        let values = this.cache.getValues()
        return currency_value / values[currency] 
    }


    USDToCurrency(currency,dolar_value){
        let values = this.cache.getValues()
        return dolar_value * values[currency]
    }

    FromToCurrency(from,to,value){
        let usd = this.CurrencyToUSD(from,value)
        let result = this.USDToCurrency(to,usd)
        return result
    }

}

module.exports = new Converter();