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
  } catch (err) {
    throw new Error(err);
  }
}

async function checkIfCurrencyExistsAndUpdate(from) {
  try {
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

    if(currency.last_updated < Date.now() - 1000 * 60 * 60) {
      updatedCurrency = await ConversionRepository.getCurrency(from);
      return await updateExchangeRate(currency.id, updatedCurrency.conversion_rates);
    }

    return currency;
  } catch (error) {
    throw new Error(error);
  }
}

async function checkIfCurrencyExists(currency) {
  try {
    return await CurrencyRepository.getByName(currency);
  } catch (error) {
    throw new Error(error);
  }
}

async function updateExchangeRate(id, exchange_rates) {
  try {
    return await CurrencyRepository.updateById(id, exchange_rates);
  } catch (error) {
    throw new Error(error);
  }
}

async function createCurrency(name, exchange_rates) {
  try {
    return await CurrencyRepository.create(name, exchange_rates, false);
  } catch (error) {
    throw new Error(error);
  }
}
