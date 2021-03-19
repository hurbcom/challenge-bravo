const { Historicalquotes } = require('../../models/schemas/coin');
const { Logger } = require('../../lib/util');
const { Logs } = require('../../models/schemas/logs');

class Currencyquotation {
  static async get(rec, res) {
    let coin1;
    let result;
    let error = false;
    let errorMessage = null;
    let logger = new Logger('info', 'logs/Bravo.log', {
      robotName: 'chalengerBravo',
      processNumber: '1',
    });
    try {
      logger.info('Message received');
      // query: { from: 'BTC', to: 'EUR', amount: '123.45' },
      let { from, to, amount } = rec.query;
      logger.info(`we will convert ${from} to ${to}`);
      coin1 = (
        await Historicalquotes.find({ coinName: 'USD' })
          .sort({ _id: -1 })
          .limit(1)
      )[0];
      result = { total: (coin1.coin[from] / coin1.coin[to]) * amount };
      logger.info(JSON.stringify(result).replace(/"|\\|{|}/gim, ''));
      res.send(result);
    } catch (e) {
      error = true;
      errorMessage = e;
      res.send(e.message);
      logger.info(e.message);
      logger.log(e.message);
    } finally {
      await Logs(
        new Logs({
          creationDate: new Date(),
          quoteCreated: coin1.queryDate,
          entryRequest: rec.query,
          output: result,
          logs: logger.allLog(),
          error,
          errorMessage,
        })
      ).save();
      logger.resetLog();
    }
  }
}

module.exports.Currencyquotation = Currencyquotation;

// (async()=>{

//   await Currencyquotation.get({query: { from: 'USD', to: 'BTC', amount: '123.45' }},"res")
// })()
