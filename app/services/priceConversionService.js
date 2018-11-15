const axios = require('axios');
const config = require('../config/config');
const resultParserHelper = require('../helpers/result_parser_helper');

const priceConversion = async (req) => {
  try {
    const response = await axios.get(`${config.CRYPTOCOMPARE_API}/data/price?fsym=${req.query.from}&tsyms=${req.query.to}`);
    const calculateResult = response.data[req.query.to] * req.query.amount;

    return resultParserHelper(req.query, calculateResult);
  } catch (error) {
    console.log(error);
  }
};

module.exports = priceConversion;
