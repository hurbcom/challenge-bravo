const {
  Historicalquotes,
  HistoricalquotesTest,
} = require('../../models/schemas/coin');
const { Logger, Helper } = require('../../lib/util');
const { Logs } = require('../../models/schemas/logs');
const { validCoins } = require('../../models/schemas/validCoins');

class Currencyquotation {
  /**
   * Gets the quote for a given currency.
   * @param {*} prod Mark whether we will consult the test bench or the production bench
   */
  static async get(req, res) {
    let prod = true;
    let coin1;
    let result;
    let error = false;
    let errorMessage = null;
    let logger = new Logger('info', 'logs/Bravo.log', {
      robotName: 'chalengerBravo',
      processNumber: '1',
    });
    try {
      logger.info('Message reqeived');
      let { from, to, amount } = req.query;
      if (req.body.test) {
        prod = req.body.prod;
      }
      let validCoin = (await validCoins.find({}).sort({ _id: -1 }).limit(1))[0]
        .validCoins;
      if (validCoin.indexOf(from) >= 0 && validCoin.indexOf(to) >= 0) {
        logger.info(`we will convert ${from} to ${to}`);
        if (prod == true) {
          coin1 = (
            await Historicalquotes.find({ coinName: 'USD' })
              .sort({ _id: -1 })
              .limit(1)
          )[0];
        } else {
          console.log('aqui');
          coin1 = (
            await HistoricalquotesTest.find({ coinName: 'USD' })
              .sort({ _id: -1 })
              .limit(1)
          )[0];
          prod = true
        }

        result = { total: (coin1.coin[from] / coin1.coin[to]) * amount };
        logger.info(JSON.stringify(result).replace(/"|\\|{|}/gim, ''));
        res.send(result);
      } else {
        // Sends an error message to the request.
        result = { error: 'Conversion has invalid currency' };
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

      return result;
    }
  }

  /**
   * Run a test request.
   */
  static async getTest(req, res) {
    return await Currencyquotation.get(req, res);
  }
}

module.exports.Currencyquotation = Currencyquotation;
