
const axios = require('axios').default;


module.exports =  async function getCurrency() {
    try {
      const response = await axios.get(`https://economia.awesomeapi.com.br/last/BRL-USD,EUR-USD,BTC-USD,ETH-USD,USD-BRL,EUR-BRL,BTC-BRL,ETH-BRL,USD-EUR,BRL-EUR,BTC-EUR,ETH-EUR`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }


