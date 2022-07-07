const Currency = require('../models/Currency');

module.exports = {
  getAll,
  getById,
  getByName,
  create,
  updateById,
  deleteById
}

async function getAll(){
  try {
    const currencies = await Currency.find();
    return currencies;
  } catch (error) {
    return error;
  }
}

async function getById(id){
  try {
    const currency = await Currency.findById(id);
    return currency;
  } catch (error) {
    return error;
  }
}

async function getByName(name){
  try {
    const currency = await Currency.findOne({ name: name });
    return currency;
  } catch (error) {
    return error;
  }
}

async function create(name, exchange_rates, isFictional){
  try {
    const currency = await Currency.create({
      name,
      exchange_rates,
      isFictional
    });
    return currency;
  } catch (error) {
    return error;
  }
}

async function updateById(id, exchange_rates){
  try {
    const currency = await Currency.findByIdAndUpdate(id, {
      exchange_rates
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
