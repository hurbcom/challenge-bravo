const express = require("express");
const app = express();
const port = 3000;
const redis = require("./cache_config/redisConfig")

app.get("/", async function(req,res){

    const requestInfo = {
        from: req.query.from,
        to: req.query.to,
        amount: req.query.amount
    }

    await redis.get("currencies", (err, reply) => {
        const data = JSON.parse(reply);
        const ticket = requestInfo.from + requestInfo.to
        res.json(
            {
                "data": data[ticket] * requestInfo.amount,
                "from": requestInfo.from,
                "to": requestInfo.to
    
            });
    })


})





app.listen(port, () => {
    console.log("Listening on port: " + port);
})



