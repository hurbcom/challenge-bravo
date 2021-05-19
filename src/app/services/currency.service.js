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

/**
 * Get currency by symbol
 * @param {string} [symbol] - Symbol of currency
 * @returns {Promise<QueryResult>}
 */
 const getBySymbol = async (symbol) => {
  const currency = await Currency.findOne({ where: { symbol } });

  if (!currency) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Currency not found');
  }

  return currency;
};

/**
 * Delete currency by id
 * @param {ObjectId} id
 * @returns {Promise<Currency>}
 */
const deleteById = async (id) => {
  const currency = await Currency.findByPk(id);

  clientRedis.del('currencies', currency.symbol);

  if (!currency) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Currency not found');
  }

  await currency.destroy();
  return currency;
};

module.exports = {
  getAll,
  create,
  deleteById,
  getBySymbol
};
