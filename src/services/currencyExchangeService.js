const Client = require('coinbase').Client;

const { API_KEY, API_SECRET } = process.env;

const client = new Client({
        apiKey: API_KEY,
        apiSecret: API_SECRET,
        strictSSL: false
    });

exports.getCurrency = (currency) =>{
    return new Promise((resolve) => {
        client.getExchangeRates({currency: currency}, function(err, rates) {
            resolve(rates);
          });
    });
};