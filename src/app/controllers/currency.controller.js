const catchAsync = require('../helpers/catchAsync');
const httpStatus = require('http-status');
const config = require('../../config/config');
const currencyService = require('../services/currency.service');

const getAll = catchAsync(async (req, res) => {
  const result = await currencyService.getAll();
  res.send(result);
});

const create = catchAsync(async (req, res) => {
  const currency = await currencyService.create(req.body);
  res.status(httpStatus.CREATED).send(currency);
});

const destroy = catchAsync(async (req, res) => {
  await currencyService.deleteById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getConversion = catchAsync(async (req, res) => {
  const { from, to } = req.params;
  const currencyFrom = await currencyService.getBySymbol(from);
  const currencyTo = await currencyService.getBySymbol(to);
  const resultConvertion = (req.params.amount * currencyFrom.rate) / currencyTo.rate;
  const { updatedAt } = currencyTo.symbol === config.currency_rate_name ? currencyFrom : currencyTo;

  res.status(httpStatus.OK).send({
    query: req.params,
    result: parseFloat(resultConvertion).toFixed(2),
    updatedAt,
  });
});

module.exports = {
  getAll,
  destroy,
  create,
  getConversion
};
