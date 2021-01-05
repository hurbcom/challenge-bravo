const makeGetHealth = require('./health')
const makeGetConversion = require('./currency/getConversion')
const makePostCurrency = require('./currency/postCurrency')
const makeDeleteCurrency = require('./currency/deleteCurrency')
const errorMessages = require('../error-messages.json')


//use-cases
const { retrieveConversion, addCurrency, removeCurrency } = require('../_use-cases')

const getHealth = makeGetHealth()
const getConversion = makeGetConversion({ errorMessages, retrieveConversion })
const postCurrency = makePostCurrency({ errorMessages, addCurrency })
const deleteCurrency = makeDeleteCurrency({ errorMessages, removeCurrency })

module.exports = {
  getHealth,
  getConversion,
  postCurrency,
  deleteCurrency
}