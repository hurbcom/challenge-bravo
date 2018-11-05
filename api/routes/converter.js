const express           = require('express');
const router            = express.Router();
const ConverterClass    = require('../services/converter')
const CONVERTER         = new ConverterClass()

router.get('/', function(req, res, next) {
  
    if(!CONVERTER.isConvertionAvailable()){
        res.status(500).send({error:"There was an error while trying to convert. Try again"})
        return
    }

    if(!CONVERTER.hasConversionFields(req.query)) {
        let fields = Object.keys(req.query).toString()
        res.status(400).send({error:`Parameters "from", "to" and "amount" are required. Received ${fields}`})
        return
    }

    if(!CONVERTER.isValidNumber(req.query.amount)) {
        res.status(400).send({error:`"amount" parameter must be a valid number greater than 0`})
        return
    }

    if(!CONVERTER.isValidCurrency(req.query)){
        let availableCurrencies = CONVERTER.getAvailableCurrencies()
        res.status(400).send({error:`The currencies you want to convert are not available. Try one of these ${availableCurrencies}`})
        return
    }

    let from = req.query.from.toUpperCase()
    let to = req.query.to.toUpperCase()
    let amount = req.query.amount
    
    let result = CONVERTER.convertfromToCurrency(from,to,amount)

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

module.exports = router;
