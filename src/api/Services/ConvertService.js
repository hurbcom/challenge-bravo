const axios = require('axios'); 

module.exports = {

async convert(req) {

  const { from, to, amount } = req;

    let moedas = `${from}-${to}`;

    const response = await axios.get('https://economia.awesomeapi.com.br/all/', {
      params: {
        moedas
      }
    });

    console.log(response);
    return response;
  }

}