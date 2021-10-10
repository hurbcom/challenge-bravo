
const axios = require('axios').default;


module.exports =  async function getCurrency() {
    try {
      const response = await axios.get(`https://economia.awesomeapi.com.br/last/BRL-USD,EUR-USD,BTC-USD,ETH-USD`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }


