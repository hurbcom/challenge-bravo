const Currency = require('./currency').currency
const CurrencyQuery = require('./currencyQuery')

Currency.methods(['get', 'post', 'put', 'delete'])

Currency.updateOptions({new: true, runValidators: true})

Currency.before('post', currencyExists).before('put', currencyExists)

async function currencyExists(req, res, next) {
    currencyCheck = await CurrencyQuery.checkExist(req.body.currency);
    if(currencyCheck.length){
        res.status(400).json({'error':'Moeda já existente no banco de dados'})
    } else {
        next();
    }
}

module.exports = Currency