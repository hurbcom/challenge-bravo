const axios = require('axios');
const config = require('../config/config');
const resultParserHelper = require('../helpers/result_parser_helper');


const priceConversion = async (request) => {
  try {
    const response = await axios.get(`${config.CRYPTOCOMPARE_API}/data/price?fsym=${request.from}&tsyms=${request.to}`);
    const calculateResult = response.data[request.to] * request.amount;

    return resultParserHelper(request, calculateResult);
  } catch (error) {
    console.log(error);
  }
};

module.exports = priceConversion;
