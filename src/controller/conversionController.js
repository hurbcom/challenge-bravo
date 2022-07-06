const ConversionService = require("../services/conversionService");

module.exports = {
  convert
}

async function convert(req, res) {
  try {
    var { from, to, amount } = req.query;
    var convertedValue = await ConversionService.convert(
      from.toUpperCase(),
      to.toUpperCase(),
      amount
    );
    return res.status(200).json({ convertedValue });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}
