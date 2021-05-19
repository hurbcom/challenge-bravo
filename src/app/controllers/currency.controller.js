const catchAsync = require('../helpers/catchAsync');
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

module.exports = {
  getAll,
  destroy,
  create
};
