const httpStatus = require('http-status');
const { Currency } = require('../models');

/**
 * Get all currencies
 * @returns {Promise<Array<Currency>>}
 */
const getAll = async () => {
  const currencies = await Currency.findAll();
  return currencies;
};

module.exports = {
  getAll
};
