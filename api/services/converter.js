class Converter {

    constructor(){
        
    }

    /**
     * @description convertCurrencyToUSD Converts the value of a currency to dollar
     * @param {string} currency_key currency you want to convert to dollars
     * @param {string} currency_value value of the currency you want to convert to dollars
     * @returns number value converted into dollars
     */
    convertCurrencyToUSD(currency_key,currency_value,currencies){
        return (currency_value / currencies[currency_key]).toFixed(3) 
    }

    /**
     * @description convertUSDToCurrency Converts the dollar value to another currency
     * @param {string} currency_key currency you want to convert
     * @param {string} dolar_value dollars value you want to convert
     * @returns {float}
     */
    convertUSDToCurrency(currency_key,dolar_value,currencies){
        return (dolar_value * currencies[currency_key]).toFixed(3)
    }

    /**
     * @description convertfromToCurrency Converts the values from one currency to another
     * @param {string} from 
     * @param {string} to 
     * @param {string} value
     * @returns {float} 
     */
    convertfromToCurrency(from,to,value,currencies){
        let usd = this.convertCurrencyToUSD(from,value,currencies)
        let result = this.convertUSDToCurrency(to,usd,currencies)
        return result
    }

}

module.exports = Converter