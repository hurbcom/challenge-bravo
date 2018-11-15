const priceConversionService = require('../services/priceConversionService');

exports.priceConversion = async (req, res, next) => {
  const result = await priceConversionService(req.query);
  res.send(result);
};
