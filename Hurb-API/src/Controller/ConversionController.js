const axios = require("axios");

class ConversionController {
  async conversion(req, res) {
    let data;
    let result = {};
    let { from, to, amount } = req.query;
    try {
      const response = await axios.get(
        `https://economia.awesomeapi.com.br/last/${from}-${to}`
      );
      data = response.data;
    } catch (error) {
      const response = await axios.get(
        `https://economia.awesomeapi.com.br/last/${'BRL'}-${'USD'}`
      );
      data = response.data;
      from = 'BRL'
      to = 'USD'
    }
    
    console.log(data);
    result.base = from
    result[to] = data[`${from}${to}`].high * amount;
    res.json(result);
  }
}
module.exports = new ConversionController();
