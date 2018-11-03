const express           = require('express');
const router            = express.Router();
const currenciesClass   = require('../services/currency')
const CURRENCIES        = new currenciesClass()

app.get('/', function (req, res) {

    //TODO: validar se é melhor utilziar metodos de available ou evitar mensagem de erro interno e buscar direto do siteda openexchangesrates.org
    if(!CURRENCIES.isCurrenciesAvailable()){
        res.status(500).send({error:"There was an error while trying rescue currencies. Try again"})
    }

    let current_currencies = CURRENCIES.getLocalCurrencies()
    
    res.status(200).send(current_currencies)
});


module.exports = router;
