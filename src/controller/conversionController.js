const ConversionService = require("../services/conversionService");

module.exports = {
  convert
}

async function convert(req, res) {
  try {
    var { from, to, amount } = req.query;
    var data = await ConversionService.convert(from, to, amount);
    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).send(error);
  }
}
