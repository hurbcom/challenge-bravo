const catchAsync = require('../helpers/catchAsync');
const currencyService = require('../services/currency.service');

const getAll = catchAsync(async (req, res) => {
  const result = await currencyService.getAll();
  res.send(result);
});

module.exports = {
  getAll
};
