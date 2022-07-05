const Currency = require('../models/currency');

module.exports = {
  getAll,
  getById,
  getByName
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