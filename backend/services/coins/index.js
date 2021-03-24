const { Historicalquotes } = require('../../models/schemas/coin');
const { Logger, Helper } = require('../../lib/util');
const { Logs } = require('../../models/schemas/logs');
const { validCoins } = require('../../models/schemas/validCoins');

class Currencyquotation {
  static async get(req, res) {
    let coin1;
    let result;
    let error = false;
    let errorMessage = null;
    let logger = new Logger('info', 'logs/Bravo.log', {
      robotName: 'chalengerBravo',
      processNumber: '1',
    });
    // console.log(req.connection.remoteAddress);
    // console.log(req.headers['x-forwarded-for']);
    // console.log(req.ip);
    // console.log(req.headers['x-forwarded-for'] ||
    // req.connection.remoteAddress);
    try {
      logger.info('Message reqeived');
      // query: { from: 'BTC', to: 'EUR', amount: '123.45' },
      let { from, to, amount } = req.query;
      let validCoin = (await validCoins.find({}).sort({ _id: -1 }).limit(1))[0]
        .validCoins;
      if (validCoin.indexOf(from) >= 0 && validCoin.indexOf(to) >= 0) {
        
        logger.info(`we will convert ${from} to ${to}`);
        coin1 = (
          await Historicalquotes.find({ coinName: 'USD' })
          .sort({ _id: -1 })
          .limit(1)
          )[0];
          result = { total: (coin1.coin[from] / coin1.coin[to]) * amount };
          logger.info(JSON.stringify(result).replace(/"|\\|{|}/gim, ''));
          res.send(result);
        }else{
          result = "Conversão possui Moeda invalida"
        }
        } catch (e) {
          error = true;
          errorMessage = e;
          res.send(e.message);
          logger.info(e.message);
          logger.log(e.message);
        } finally {
          await Logs(
            new Logs({
          creationDate: Helper.saveDateMongo(),
          quoteCreated: coin1.queryDate,
          entryRequest: req.query,
          output: result,
          logs: logger.allLog(),
          error,
          errorMessage,
          ip: `${
            req.headers['x-forwarded-for'] || req.connection.remoteAddress
          }`,
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
