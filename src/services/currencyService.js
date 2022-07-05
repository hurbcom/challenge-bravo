const CurrencyRepository = require('../repositories/currencyRepository');

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById
}

async function getAll() {
  try {
    const currencies = await CurrencyRepository.getAll();
    return currencies;
  } catch (error) {
    return error;
  }
}

async function getById(id){
  try {
    const currency = await CurrencyRepository.getById(id);
    return currency;
  } catch (error) {
    return error;
  }
}

async function create(name, exchange_rate){
  try {
    const currency = new Currency({
      name,
      exchange_rate
    });
    await currency.save();
    return currency;
  } catch (error) {
    return error;
  }
}

async function updateById(id, name, value){
  try {
    const currency = await Currency.findByIdAndUpdate(id, {
      name,
      exchange_rate
    });
    return currency;
  } catch (error) {
    return error;
  }
}

async function deleteById(id){
  try {
    const currency = await Currency.findByIdAndDelete(id);
    return currency;
  } catch (error) {
    return error;
  }
}
