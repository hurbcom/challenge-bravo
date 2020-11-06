const Currency = require('../Models/CurrencyModel');
const ApiService = require('./ApiService');

module.exports = {

  async convert(req, res) {

    let { from, to, amount } = req;
    let fromUper = from.toUpperCase();
    let toUpper = to.toUpperCase();

    const findCurrencyTo = await Currency.findOne({ currency: toUpper });
    const findCurrencyFrom = await Currency.findOne({ currency: fromUper });

    if ((findCurrencyTo == null) || (findCurrencyFrom == null)) {
      throw { msg: "Currency not avaliable" }
    }

    const response = await ApiService.currencyApi();
    
    if(response == null){
      throw { msg: "Service not avaliable" }
    }

    const data = response.data;

    for (let coin of Object.entries(data)) {
      if (coin.indexOf(fromUper) !== -1) {
        var amountResultBRL = amount * (coin[1].high);
      }
    }

    if (toUpper == 'BRL') {
      var amountResult = `${toUpper} : ${amountResultBRL}`;
    } else {
      for (let coin of Object.entries(data)) {
        if (coin.indexOf(toUpper) !== -1) {
          var amountResult = `${toUpper} : ${((amount * (coin[1].high)) / amountResultBRL)}`;
        }
      }
    }

    return amountResult;
  }
}