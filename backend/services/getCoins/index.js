const axios = require('axios');
const sleep = require('await-sleep');
const mongoose = require('mongoose');

const { Historicalquotes } = require('../../models/schemas/coin');
const { enums } = require('../../configs/enums');
const { Helper } = require('../../lib/util');


class GetConversion {
  constructor(production = false) {
    if (production === false) {
      this.url = enums.apiCoin.url
      this.sleep = 1000
    } else {
      this.url = `${enums.apiCoin.url}?key${enums.apiCoin.key}`
      this.sleep = 500
    }
  }
  /**
   * Captura as cotações de moedas
   */
  async get() {
    while (true) {
      await sleep(this.sleep);
      let getCoin = (await axios({
        url: this.url,
        method: "get"
      })).data.results.currencies
      let data = Helper.clock()
      let stringData = `${data.dia}/${data.mes}/${data.ano4} ${data.hora}:${data.min}:${data.seg}`
      // save in db
      let { USD, EUR, BTC } = getCoin
      let array = [{ USD: USD }, { EUR: EUR }, { BTC: BTC }];
      console.log(array[0]);
      console.log(Object.keys(array[0])[0]);
      console.log(stringData);
      console.log(Helper.data(stringData));
      // process.exit()
      for (let i = 0; i < array.length; i++) {
        let object = {
          coinName: Object.keys(array[i])[0],
          queryDate: Helper.data(stringData),
          coinBase: getCoin.source,
          coin: array[i][Object.keys(array[i])[0]]
        }
        await Historicalquotes(object).save()
      }
    }
  }

  /**
   * Sanitiza o banco de dados a cada dia para um pariodo superior a 7 dias.
   */
  static async delete() {
    while (true) {
      await sleep(60000 * 60 * 24);
      await Historicalquotes.deleteMany({
        queryDate: {
          "$gt": Helper.subtractDate(new Date(), 7)
        }
      })
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
    console.log("Conectado ao mongo");
  } catch (e) {
    console.log(e);
    process.exit()
  }

  await new GetConversion().get()
  await GetConversion.delete()
})()