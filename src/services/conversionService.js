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

  if(!currency) {
    currency = await ConversionRepository.getCurrency(from);
    return await createCurrency(
      currency.base_code,
      currency.conversion_rates
    )
  }

  if(currency.isFictional) {
    return currency;
  }

  // updates currency if it has not been updated in a day
  if(currency.last_updated < new Date(Date.now() - 86400000)) {
    updatedCurrency = await ConversionRepository.getCurrency(from);
    return await updateExchangeRate(currency.id, updatedCurrency.conversion_rates);
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
