const axios = require('axios');
const sleep = require('await-sleep');
const mongoose = require('mongoose');

require('../../configs/bootstrap');
const {
  Historicalquotes,
  HistoricalquotesTest,
} = require('../../models/schemas/coin');
const { enums } = require('../../configs/enums');
const { Helper } = require('../../lib/util');

class GetConversion {
  constructor(production = false) {
    if (production === false) {
      this.url = enums.apiCoin.url;
      this.sleep = 60000 * 60 * 2; // => 2 hours
    } else {
      this.url = `${enums.apiCoin.url}?key${enums.apiCoin.key}`;
      this.sleep = 60000 * 5; // => 5 minutes
    }
  }
  /**
   * Captures currency quotes
   */
  async get() {
    let array = {
      USD: {
        USD: 1,
      },
    };
    while (true) {
      let getCrypto = (
        await axios({
          method: 'get',
          url: enums.apiCrypto.url,
          headers: { 'X-CMC_PRO_API_KEY': enums.apiCrypto.key },
        })
      ).data.data;
      getCrypto.map((x) => {
        array.USD[x.symbol] = x.quote.USD.price;
      });

      let getCoin = (
        await axios({
          method: 'get',
          url: `${enums.apiCoin.url}/api/latest?access_key=${enums.apiCoin.key}`,
        })
      ).data.rates;
 
      let coinBase = [];
      // let usd = getCoin.USD;
      let eur = 1 / getCoin.USD;
      Object.keys(getCoin).forEach((x) => {
        coinBase.push(x);
      });
      coinBase.map((x) => {
        if (x != 'USD') {
          array.USD[x]=getCoin[x] * eur
        }
      });

      console.log(Helper.saveDateMongo());
      let object = {
        coinName: 'USD',
        queryDate: Helper.saveDateMongo(),
        coinBase: 'USD',
        coin: array.USD,
      };
      await Historicalquotes(object).save();
      console.log('save !');
      await sleep(this.sleep);
    }
  }

  /**
   * Sanitize the database every day for a period greater than 7 days
   */
  static async delete() {
    while (true) {
      await sleep(60000 * 10);
      await Historicalquotes.deleteMany({
        queryDate: {
          $gt: Helper.subtractDate(new Date(), 7),
        },
      });
    }
  }

  async test() {
    let array = {
      USD: {
        USD: 1,
        BTC: 3.3,
        ETH: 1.5,
        EUR: 1.7,
        BRL: 0.3,
      },
    };
    let object = {
      coinName: 'USD',
      queryDate: Helper.saveDateMongo(),
      coinBase: 'USD',
      coin: array.USD,
    };
    await HistoricalquotesTest(object).save();
    console.log('save !');
    await sleep(this.sleep);
  }
}
(async () => {
  // new GetConversion(false).delete();
  new GetConversion(false).get();
  new GetConversion(false).test();
})();
