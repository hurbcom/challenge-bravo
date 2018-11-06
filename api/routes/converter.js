const express           = require('express');
const router            = express.Router();
const ConverterClass    = require('../services/converter')
const converter         = new ConverterClass()

router.get('/', function(req, res, next) {
    
    if(!converter.isConvertionAvailable()){
        res.status(500).send({error:"There was an error while trying to convert. Try again"})
        return
    }

    if(!hasConversionFields(req.query)) {
        let fields = Object.keys(req.query).toString()
        res.status(400).send({error:`Parameters "from", "to" and "amount" are required. Received ${fields}`})
        return
    }

    if(isValidNumber(req.query.amount)) {
        res.status(400).send({error:`"amount" parameter must be a valid number greater than 0`})
        return
    }

    if(isValidCurrency(req.query.from, req.query.to)){
        let availableCurrencies = converter.getAvailableCurrencies().toString()
        res.status(400).send({error:`The currencies you want to convert are not available. Try one of these ${availableCurrencies}`})
        return
    }

    let from = req.query.from.toUpperCase()
    let to = req.query.to.toUpperCase()
    let amount = req.query.amount
    
    let result = converter.convertfromToCurrency(from,to,amount)

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
 * @description isValidCurrency Checks if the desired currency exists / is valid to be converted
 * @param {Object} body 
 * @returns {boolean}
 */
function isValidCurrency(from,to){

    if(!from || !to) return false

    let values = converter.getAvailableCurrencies()
    let from = from.toUpperCase()
    let to = to.toUpperCase()

    if(!values.includes(from) || !values.includes(to)) return false

    return true
}

module.exports = router;
