const httpStatus = require('http-status');
const redis = require('async-redis');
const catchAsync = require('../helpers/catchAsync');
const currencyService = require('../services/currency.service');
const config = require('../../config/config');

const clientRedis = redis.createClient({ host: 'redis' });
const CACHE_LIFETIME_MINUTES = 5 * 60;

const dataCached = async (cacheKey, func, arg = null) => {
  const dataInCache = await clientRedis.get(cacheKey);
  if (dataInCache) {
    return JSON.parse(dataInCache);
  }
  const result = await currencyService[func](arg);
  await clientRedis.setex(cacheKey, CACHE_LIFETIME_MINUTES, JSON.stringify(result));
  return result;
};

const destroy = catchAsync(async (req, res) => {
  await currencyService.deleteById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const create = catchAsync(async (req, res) => {
  const currency = await currencyService.create(req.body);
  res.status(httpStatus.CREATED).send(currency);
});

const getAll = catchAsync(async (req, res) => {
  const result = await dataCached('currencies', 'getAll');
  res.send(result);
});

const getConversion = catchAsync(async (req, res) => {
  const { from, to } = req.params;
  const currencyFrom = await dataCached(from, 'getBySymbol', from);
  const currencyTo = await dataCached(to, 'getBySymbol', to);
  const resultConvertion = (req.params.amount * currencyFrom.rate) / currencyTo.rate;
  const { updatedAt } = currencyTo.symbol === config.currency_rate_name ? currencyFrom : currencyTo;

  res.status(httpStatus.OK).send({
    query: req.params,
    result: parseFloat(resultConvertion).toFixed(2),
    updatedAt,
  });
});

module.exports = {
  destroy,
  create,
  getConversion,
  getAll,
};
