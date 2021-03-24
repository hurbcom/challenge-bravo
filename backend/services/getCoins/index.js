const axios = require('axios');
const sleep = require('await-sleep');
const mongoose = require('mongoose');

const { Historicalquotes } = require('../../models/schemas/coin');
const { enums } = require('../../configs/enums');
const { Helper } = require('../../lib/util');

class GetConversion {
  constructor(production = false) {
    if (production === false) {
      this.url = enums.apiCoin.url;
      this.sleep = 6000000;
    } else {
      this.url = `${enums.apiCoin.url}?key${enums.apiCoin.key}`;
      this.sleep = 300000;
    }
  }
  /**
   * Captura as cotações de moedas
   */
  async get() {
    let array = {
      USD: {
        USD: 1,
      },
    };
    while (true) {
      let getCoin = (
        await axios({
          method: 'get',
          url:
            'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
          headers: {
            'X-CMC_PRO_API_KEY': '9e009ee7-bc83-4b10-8b17-cd4c8a9b0272',
          },
        })
      ).data.data;
      // console.log(getCoin);
      getCoin.map((x) => {
        array.USD[x.symbol] = x.quote.USD.price;
      });
      // console.log(array);
      // process.exit();
      // let data = Helper.clock()
      // let stringData = `${data.dia}/${data.mes}/${data.ano4} ${data.hora}:${data.min}:${data.seg}`
      // save in db
      // let { USD, EUR, BTC } = getCoin
      // let array = [{ USD: USD }, { EUR: EUR }, { BTC: BTC }];
      // console.log(array[2]);
      // console.log(Object.keys(array[0])[0]);
      // console.log(stringData);
      console.log(Helper.saveDateMongo());
      // process.exit()
      // for (let i = 0; i < array.length; i++) {
      let object = {
        coinName: 'USD',
        // coinName: Object.keys(array[i])[0],
        // coinName: Object.keys(array[i])[0],
        queryDate: Helper.saveDateMongo(),
        coinBase: 'USD',
        coin: array.USD,
        // coin: array[i][Object.keys(array[i])[0]]
      };
      await Historicalquotes(object).save();
      // }
      console.log("save !");
      await sleep(this.sleep);
    }
  }

  /**
   * Sanitiza o banco de dados a cada dia para um pariodo superior a 7 dias.
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
}
(async () => {
  try {
    mongoose.connect(enums.mongo.connString, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado ao mongo');
  } catch (e) {
    console.log(e);
    process.exit();
  }

  // GetConversion.delete()
  new GetConversion(false).get();
})();
