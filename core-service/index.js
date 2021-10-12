const express = require("express");
const app = express();
const port = 3000;
const redis = require("./cache_config/redisConfig");
const areCurrenciesExist = require("./service/sanitaze");
const requestInfoService = require("./service/requestInfoService");
const exchangeService = require("./service/exchangeService");
const createCurrencyService = require("./service/createCurrencyService");
const removeCurrencyService = require("./service/removeCurrencyService");
const defaultCurrencies = require("./resource/defaultCurrencies");
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
            res.status(400).send({"message": "Currency exchange not supported"})
        }

        
    })
})

app.post("/", function(req,res){
    if(!defaultCurrencies.includes(req.body.currencyName)){
        redis.get("currencies", (err, reply) => {
            redis.get("convertingRules", (err, convertingRules) => {
    
                //Call routine to create currency and Currency rule of conversion.
                const response = createCurrencyService(reply,req,convertingRules);
                
                if(response.flag){
                    res.json({
                        "CurrencyCreated": req.body.currencyName,
                        "ExchangeUSDpair": response.pairUsd
                    });
                }else{
                    res.json({
                        "Error": "Currency could not be created"
                    });
                }
            })
        })
    }else{
        res.status(403).send({"message": "Change such currency is not supported"})
    }

})

app.delete("/", function(req,res){
    if(!defaultCurrencies.includes(req.query.currencyName)){
        redis.get("currencies", (err, reply) => {
            redis.get("convertingRules", (err, convertingRules) => {
            
            const currenciesData = JSON.parse(reply);
            const convertingRulesData = JSON.parse(convertingRules)
            
            if(currenciesData.hasOwnProperty(req.query.currencyName) && convertingRulesData.hasOwnProperty(req.query.currencyName)){
                
                const removeCurrencyRef = removeCurrencyService(req,currenciesData,convertingRulesData);
    
                res.json({"message": "Currency removed"})
    
            }else{
                res.json({"message": "Currency does not exist"})
            }
    
            })
        })
    }else{
        res.status(403).send({"message":"Remove such currency is not supported"})
    }
    
})

const appServer = app.listen(port, () => {
    console.log("Listening on port: " + port);
})


module.exports = appServer