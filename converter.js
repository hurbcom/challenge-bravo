let CacheClass = require('./cache')

class Converter {

    constructor(){
        this.cache = new CacheClass()
    }

    /**
     * @description CurrencyToUSD Converts the value of a currency to dollar
     * @param {string} currency 
     * @param {string} currency_value 
     * @returns {float}
     */
    CurrencyToUSD(currency,currency_value){
        let values = this.cache.getValues()
        return currency_value / values[currency] 
    }

    /**
     * @description USDToCurrency Converts the dollar value to another currency
     * @param {string} currency 
     * @param {string} dolar_value 
     * @returns {float}
     */
    USDToCurrency(currency,dolar_value){
        let values = this.cache.getValues()
        return dolar_value * values[currency]
    }

    /**
     * @description FromToCurrency Converts the values from one currency to another
     * @param {string} from 
     * @param {string} to 
     * @param {string} value
     * @returns {float} 
     */
    FromToCurrency(from,to,value){
        let usd = this.CurrencyToUSD(from,value)
        let result = this.USDToCurrency(to,usd)
        return result
    }

    /**
     * @description hasConversionFields Checks whether the object has the attributes "from", "to" and "amount"
     * @param {*} body 
     * @returns {boolean}
     */
    hasConversionFields(body){
        return ['from','to','amount'].every(f => Object.keys(body).includes(f))
    }

    /**
     * @description isValidNumber Checks if number is valid and greater than 0
     * @param {string | integer} number
     * @returns {boolean}
     */
    isValidNumber(number){
        return !isNaN(number) && Number(number) > 0;
    }

    /**
     * @description isValidCurrency Checks if the desired currency exists / is valid to be converted
     * @param {Object} body 
     * @returns {boolean}
     */
    isValidCurrency(body){
        let values = this.cache.getValues()
        let from = body.from.toUpperCase()
        let to = body.to.toUpperCase()

        if(!Object.keys(values).includes(from) || !Object.keys(values).includes(to)) return false

        return true
    }

    /** 
     * @description getAvailableCurrencies returns what currencies are available
     * @returns {string}
    */
    getAvailableCurrencies(){
       let values = this.cache.getValues()
       let currencies = Object.keys(values).toString()
       return currencies
    }
    
    /** 
     * @description isConvertionAvailable Check if currencies already exist for conversions
     * @returns {boolean}
    */
    isConvertionAvailable(){
        if(this.cache.getValues()) return true
        return false;
    }

}

module.exports = new Converter();