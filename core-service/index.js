const express = require("express");
const app = express();
const port = 3000;
const redis = require("./cache_config/redisConfig")
const areCurrenciesExist = require("./service/sanitaze")
const requestInfoService = require("./service/requestInfoService")
const exchangeService = require("./service/exchangeService")

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

app.listen(port, () => {
    console.log("Listening on port: " + port);
})



