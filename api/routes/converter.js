const express           = require('express');
const config            = require('config')
const router            = express.Router();
const ConverterClass    = require('../services/converter')
const CacheClass        = require('../services/cache')
const converter         = new ConverterClass()
const cache             = new CacheClass();

router.get('/', function(req, res, next) {
    
    if(!isConvertionAvailable()){
        res.status(500).send({error:"There was an error while trying to convert. Try again"})
        return
    }

    if(!hasConversionFields(req.query)) {
        let fields = Object.keys(req.query).toString()
        res.status(400).send({error:`Parameters "from", "to" and "amount" are required. Received ${fields}`})
        return
    }

    if(!isValidNumber(req.query.amount)) {
        res.status(400).send({error:`"amount" parameter must be a valid number greater than 0`})
        return
    }

    if(!isValidCurrency(req.query.from, req.query.to)){
        let availableCurrencies = getAvailableCurrencies().toString()
        res.status(400).send({error:`The currencies you want to convert are not available. Try one of these ${availableCurrencies}`})
        return
    }

    let from = req.query.from.toUpperCase()
    let to = req.query.to.toUpperCase()
    let amount = req.query.amount
    let currencies = cache.values
    
    let result = converter.convertfromToCurrency(from,to,amount,currencies)

    if(!result) {
        res.status(500).send({error:"There was an error while trying to convert. Try again"})
        return
    }
    
    let response = {
        from,
        to,
        amount,
        result
    }

    res.status(200).send(response)

});

/**
 * @description hasConversionFields Checks whether the object has the attributes "from", "to" and "amount"
 * @param {*} body 
 * @returns {boolean}
 */
function hasConversionFields(query){
    return ['from','to','amount'].every(f => Object.keys(query).includes(f))
}

/**
 * @description isValidNumber Checks if number is valid and greater than 0
 * @param {string | integer} number
 * @returns {boolean}
 */
function isValidNumber(number){
    return !isNaN(number) && Number(number) > 0;
}

/**
 * @description isValidCurrency Checks if the desired currency exists in our cache / is valid to be converted
 * @param {Object} body 
 * @returns {boolean}
 */
function isValidCurrency(from,to){

    if(!from || !to) return false

    let values = getAvailableCurrencies()
    from = from.toUpperCase()
    to = to.toUpperCase()

    if(!values.includes(from) || !values.includes(to)) return false

    return true
}

 /** 
 * @description isConvertionAvailable Check if any currencies already exists in out cache for some conversions
 * @returns {boolean}
 * */
function isConvertionAvailable(){
    if(JSON.stringify(cache.values) != JSON.stringify({})) {
        return true
    } else {
        return false
    }
}

/** 
 * @description getAvailableCurrencies returns what currencies are available in our cache
 * @returns {string}
*/
function getAvailableCurrencies(){
    let values = cache.values
    let currencies = Object.keys(values)
    return currencies
}

/**
 * @description getLastCurrencies refresh at configured time currencies values in our cache
 */
async function getLastCurrencies(){

    let currencies = config.currencies
    for(let c of currencies){
       try {
            cache.values[c] = await cache.getKey(c)
       } catch (error) {    
           console.log(error)
       }
    }
    console.log("Currencies atualizadas com sucesso!")

    setTimeout(()=> getLastCurrencies(), config.currencies_cache_time_minutes * 60 * 1000)
}

getLastCurrencies()


module.exports = {
        converterRouter:router,
        hasConversionFields,
        isValidNumber,
        isValidCurrency,
        isConvertionAvailable,
        getAvailableCurrencies,
        getLastCurrencies
    };
