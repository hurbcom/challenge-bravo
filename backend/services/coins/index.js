const { Historicalquotes } = require('../../models/schemas/coin');

class Currencyquotation {
  static async get(rec, res) {
    // query: { from: 'BTC', to: 'EUR', amount: '123.45' },
    let { from, to, amount } = rec.query
    let coin1 = (await Historicalquotes.find({ "coinName": "USD" }).sort({ "_id": -1 }).limit(1))[0]
    console.log(coin1.coin[from] / coin1.coin[to] * amount);
    res.send({ total: coin1.coin[from] / coin1.coin[to] * amount })
  }
}

module.exports.Currencyquotation = Currencyquotation;

// (async()=>{

//   await Currencyquotation.get({query: { from: 'USD', to: 'BTC', amount: '123.45' }},"res")
// })()