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

async function create(name, exchange_rates, isFictional){
  try {
    const currency = await CurrencyRepository.create(name, exchange_rates, isFictional);
    return currency;
  } catch (error) {
    return error;
  }
}

async function updateById(id, name, exchange_rates){
  try {
    const currency = await CurrencyRepository.updateById(id, name, exchange_rates);
    return currency;
  } catch (error) {
    return error;
  }
}

async function deleteById(id){
  try {
    const currency = await CurrencyRepository.deleteById(id);
    return currency;
  } catch (error) {
    return error;
  }
}
