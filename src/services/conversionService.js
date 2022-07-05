const CurrencyRepository = require("../repositories/currencyRepository");

module.exports = { convert }

async function convert(from, to, amount) {
  try {
    var converted_amount;
    var currency = await checkIfCurrencyExists(from);

    if(!currency) {
      currency = await ConversionRepository.getCurrency(from);
    }

    if(currency.conversion_rates[to]) {
      converted_amount = amount * currency.conversion_rates[to];
    } else {
      throw new Error("Currency not found");
    }

    return converted_amount;
  } catch (error) {
    return error;
  }
}

async function checkIfCurrencyExists(currency) {
  return await CurrencyRepository.getByName(currency);
}

