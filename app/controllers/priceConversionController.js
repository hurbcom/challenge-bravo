const priceConversionService = require('../services/priceConversionService');
const validateHelper = require('../helpers/validate_helper');

exports.priceConversion = async (req, res) => {
  if (!validateHelper(req.query)) {
    return res.status(400).send('Bad Request');
  }
  const result = await priceConversionService(req);
  res.send(result);
};
