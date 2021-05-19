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

/**
 * Create a currency
 * @param {Object} currencyBody
 * @returns {Promise<Currency>}
 */
 const create = async (currencyBody) => {
  const { symbol } = currencyBody;

  if (await Currency.findOne({ where: { symbol } })) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Currency already exists');
  }

  const currency = await Currency.create(currencyBody);
  return currency;
};

module.exports = {
  getAll
};
