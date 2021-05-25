const httpStatus = require('http-status');
const redis = require('async-redis');
const { Currency } = require('../models');
const ApiError = require('../helpers/ApiError');

const clientRedis = redis.createClient({ host: 'redis' });

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

  clientRedis.del('currencies');

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
 * Create a currency
 * @param {string} [symbol] - Symbol of currency
 * @param {Object} data
 * @returns {Promise<Currency>}
 */
const updateBySymbol = async (symbol, data) => {
  const currency = await getBySymbol(symbol);
  return currency.update(data);
};

/**
 * Get all currencies
 * @returns {Promise<Array<Currency>>}
 */
const getAll = async () => {
  const currencies = await Currency.findAll();
  return currencies;
};

/**
 * Get standard currencies
 * @returns {Promise<Array<Currency>>}
 */
const getStandardCurrencies = async () => {
  const currencies = await Currency.findAll({
    where: {
      default: true,
    },
  });
  return currencies;
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
  getStandardCurrencies,
  create,
  getAll,
  getBySymbol,
  deleteById,
  updateBySymbol,
};
