let Cache = require('./cache')

class Converter {
    //TODO: criar testes de unidade
    constructor(){
        this.cache = new Cache()
    }

    /**
     * @description convertCurrencyToUSD Converts the value of a currency to dollar
     * @param {string} currency currency you want to convert to dollars
     * @param {string} currency_value value of the currency you want to convert to dollars
     * @returns number value converted into dollars
     */
    convertCurrencyToUSD(currency,currency_value){
        let values = this.cache.values
        return currency_value / values[currency] 
    }

    //TODO: melhorar descricoes
    /**
     * @description convertUSDToCurrency Converts the dollar value to another currency
     * @param {string} currency 
     * @param {string} dolar_value 
     * @returns {float}
     */
    convertUSDToCurrency(currency,dolar_value){
        let values = this.cache.values
        return dolar_value * values[currency]
    }

    /**
     * @description convertfromToCurrency Converts the values from one currency to another
     * @param {string} from 
     * @param {string} to 
     * @param {string} value
     * @returns {float} 
     */
    convertfromToCurrency(from,to,value){
        let usd = this.convertCurrencyToUSD(from,value)
        let result = this.convertUSDToCurrency(to,usd)
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
        let values = this.cache.values
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
       let values = this.cache.values
       let currencies = Object.keys(values).toString()
       return currencies
    }
    
    /** 
     * @description isConvertionAvailable Check if currencies already exist for conversions
     * @returns {boolean}
    */
    isConvertionAvailable(){
        if(this.cache.values != {}) {
            return true
        } else {
            return false
        }
    }

}

module.exports = Converter