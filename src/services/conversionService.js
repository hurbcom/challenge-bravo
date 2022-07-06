const CurrencyRepository = require("../repositories/currencyRepository");
const ConversionRepository = require("../repositories/conversionRepository");

module.exports = {
  convert,
  checkIfCurrencyExists
};

async function convert(from, to, amount) {
  try {
    var converted_amount;

    var currency = await checkIfCurrencyExistsAndUpdate(from);

    if(currency.exchange_rates[0][to]) {
      converted_amount = amount * currency.exchange_rates[0][to];
    }

    return converted_amount;
  } catch (error) {
    return error;
  }
}

async function checkIfCurrencyExistsAndUpdate(from) {
  var currency = await checkIfCurrencyExists(from);
  var updateCurrency = await ConversionRepository.getCurrency(from);

  if(!currency) {
    currency = await CurrencyRepository.create(
      updateCurrency.base_code, updateCurrency.conversion_rates, false
    );
  } else {
    currency = await updateExchangeRate(
      currency.id, updateCurrency.conversion_rates
    );
  }

  return currency;
}

async function checkIfCurrencyExists(currency) {
  return await CurrencyRepository.getByName(currency);
}

async function updateExchangeRate(id, exchange_rates) {
  return await CurrencyRepository.updateById(id, exchange_rates);
}
