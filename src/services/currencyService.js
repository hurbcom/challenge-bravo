const Currency = require('../models/currency');

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById
}

async function getAll() {
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

async function create(name, value){
  try {
    const currency = new Currency({
      name,
      value
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
      value
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
