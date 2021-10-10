const express = require("express");
const app = express();
const port = 3000;
const redis = require("./cache_config/redisConfig")
const areCurrenciesExist = require("./service/sanitaze")
const requestInfoService = require("./service/requestInfoService")
const exchangeService = require("./service/exchangeService")
app.use(express.json());

app.get("/", function(req,res){
    redis.get("currencies", (err, reply) => {
        
        const data = JSON.parse(reply);
        const requestInfo = requestInfoService(req);

        if(areCurrenciesExist(requestInfo.from, requestInfo.to, data)){
            const exchange = exchangeService(requestInfo.from, requestInfo.to, data);
            res.json(
                {
                    "data": exchange * requestInfo.amount,
                    "from": requestInfo.from,
                    "to": requestInfo.to
                });
        }else{
            res.json({"Error": "Currency exchange not supported"})
        }

        
    })
})

app.post("/", async function(req,res){
    redis.get("currencies", (err, reply) => {

        var data = JSON.parse(reply);
        const pairUsd = data[req.body.exchangePairName] * req.body.exchangePairValue;
        data[req.body.currencyName] = pairUsd;

        const insertCurrency = redis.set("currencies", JSON.stringify(data));

        if(insertCurrency){
            res.json({
                "CurrencyCreated": req.body.currencyName,
                "ExchangeUSDpair": pairUsd
            });
        }else{
            res.json({
                "Error": "Currency could not be created"
            });
        }
    })
})

app.delete("/", function(req,res){
    redis.get("currencies", (err, reply) => {
        
        const data = JSON.parse(reply);
        const requestInfo = requestInfoService(req);

        if(data.hasOwnProperty(req.query.currencyName)){
            delete data[req.query.currencyName];
            const updateExchangePairs = redis.set("currencies", JSON.stringify(data));
            res.json({"message": "Currency removed"})

        }else{
            res.json({"message": "Currency does not exist"})
        }

        
    })
})

app.listen(port, () => {
    console.log("Listening on port: " + port);
})



