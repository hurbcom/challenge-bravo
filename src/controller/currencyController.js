const currencyModel = require('../model/currency');
var request = require('request');

exports.currencies = async(req, res, next) => {
  try {
    var currency = await currencyModel.find({});
    return res.json({currency});
    } catch (err) {
      throw err;
    }
};

exports.currencySuported = async(req, res) => {

  const coin = req.body.coin.toUpperCase();
  const action = req.body.action.toUpperCase();

  if (action == "ADD") {

      var currency = await currencyModel.find({type: coin});

      if(currency.length == 0){

      currency = await currencyModel.create({type: coin});
      return res.sendStatus(201);
      }

      return res.status(412).json({error: "Unable to add currency. Existing currency."});

  } else if (action == "REMOVE"){

      var currency = await currencyModel.find({type: coin});
      if(currency.length == 0){
        return res.status(412).json({error: "Unable to remove currency. Currency not found"})
      }
      currency = await currencyModel.deleteOne({ type: coin});
      console.log(currency)
      return res.sendStatus(200)

  }else{

    return res.status(412).json({error: "Unable to convert."});
  }
};

exports.currencyConvert = async(req, res) => {
  try {
        const fromCoin = req.query.from.toUpperCase();
        const toCoin = req.query.to.toUpperCase();
        const amountCoin = req.query.amount;

          var currencyFrom = await currencyModel.find({type: fromCoin });
          var currencyTo = await currencyModel.find({type: toCoin });

          if(currencyFrom.length == 0 || currencyTo.length == 0  ){
            return res.status(412).json({error: "Could not use this currency."});
          }

          var options = {
            method: 'GET',
            url: 'https://min-api.cryptocompare.com/data/price',
            qs: {fsym: fromCoin, tsyms: toCoin},
            headers: {
              'ApiKey': 'f020507c947e527ad8a15a33d26687fb306b1b527e9984094d95151ad1e02dfb',
            }
          };
          
          request(options, function (error, response, body) {
              if (error) throw new Error(error);
              var currency = JSON.parse(body);
              currency = currency[toCoin].toFixed(2) * amountCoin;
              return res.json({conversao : currency});
          });    
               
      } catch (err) {
        console.log(err)
        return res.status(500)
      }
};
