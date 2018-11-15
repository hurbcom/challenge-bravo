const axios = require('axios');
const config = require('../config/config');

const priceConversion = async (request) => {
  try {
    const response = await axios.get(`${config.CRYPTOCOMPARE_API}/data/price?fsym=${request.from}&tsyms=${request.to}`);

    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = priceConversion;
