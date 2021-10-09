const express = require("express");
const app = express();
const axios = require('axios').default;
const port = 3000;

app.get("/", async function(req,res){
    const data = await getCurrency();
    const currencies = {
        USDUSD: 1,
        BRLUSD: data.BRLUSD.bid,
        EURUSD: data.EURUSD.bid,
        BTCUSD: data.BTCUSD.bid,
        ETHUSD: data.ETHUSD.bid,
        BRLBRL: 1,
        USDBRL: data.USDBRL.bid,
        EURBRL: data.EURBRL.bid,
        BTCBRL: data.BTCBRL.bid,
        ETHBRL: data.ETHBRL.bid,
        EUREUR: 1,
        USDEUR: data.USDEUR.bid,
        BRLEUR: data.BRLEUR.bid,
        BTCEUR: data.BTCEUR.bid,
        ETHEUR: data.ETHEUR.bid,
        //Como as criptoes não possuem cotação na api, é necessário fazer uma manipulação.
        BTCBTC: 1,
        USDBTC: 1/data.BTCUSD.bid,
        BRLBTC: 1/data.BTCBRL.bid,
        EURBTC: 1/data.BTCEUR.bid,
        ETHBTC: data.ETHUSD.bid/data.BTCUSD.bid,
        ETHETH: 1,
        USDETH: 1/data.ETHUSD.bid,
        BRLETH: 1/data.ETHBRL.bid,
        EURETH: 1/data.ETHEUR.bid,
        BTCETH: data.BTCUSD.bid/data.ETHUSD.bid
    }
    const requestInfo = {
        from: req.query.from,
        to: req.query.to,
        amount: req.query.amount
    }


    const ticket = requestInfo.from + requestInfo.to
    res.json(
        {
            "data": currencies[ticket] * requestInfo.amount,
            "from": requestInfo.from,
            "to": requestInfo.to

        });


})





app.listen(port, () => {
    console.log("Listening on port: " + port);
})



async function getCurrency() {
    try {
      const response = await axios.get(`https://economia.awesomeapi.com.br/last/BRL-USD,EUR-USD,BTC-USD,ETH-USD,USD-BRL,EUR-BRL,BTC-BRL,ETH-BRL,USD-EUR,BRL-EUR,BTC-EUR,ETH-EUR`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }




