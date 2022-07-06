const CurrencyRepository = require("../repositories/currencyRepository");
const ConversionRepository = require("../repositories/conversionRepository");

module.exports = {
  convert,
  checkIfCurrencyExistsAndUpdate,
  updateExchangeRate,
  createCurrency
};

async function convert(from, to, amount) {
  try {
    var converted_amount;

    var currency = await checkIfCurrencyExistsAndUpdate(from);

    if(currency.exchange_rates[0][to]) {
      converted_amount = amount * currency.exchange_rates[0][to];
    } else {
      return new Error("Currency to be converted to not found");
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
    currency = await createCurrency(
      updateCurrency.base_code,
      updateCurrency.conversion_rates
    )
  }

  if(currency.isFictional) {
    return currency;
  }

  if(currency && updateCurrency) {
    currency = await updateExchangeRate(currency.id, updateCurrency.conversion_rates);
  }

  if(!currency && !updateCurrency) {
    return new Error("Currency doesnt exist yet and we dont have data to create it");
  }

  return currency;
}

async function checkIfCurrencyExists(currency) {
  return await CurrencyRepository.getByName(currency);
}

async function updateExchangeRate(id, exchange_rates) {
  return await CurrencyRepository.updateById(id, exchange_rates);
}

async function createCurrency(name, exchange_rates) {
  return await CurrencyRepository.create(name, exchange_rates, false);
}