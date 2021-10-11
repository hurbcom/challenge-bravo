const redis = require("../redis_config/cacheConfig");


module.exports = (reply,data,jsonData) => {
    redis.get("convertingRules", (err, rulesReturn) => {

        const rules = JSON.parse(rulesReturn);
        console.log(rules);
        for(currKey in jsonData){
            if(currKey == "USD"){
                continue
            }else{
                jsonData[currKey] = rules[currKey].value * data[rules[currKey].pairExchange+"USD"].bid
            }
        }
        redis.set("currencies", JSON.stringify(jsonData),function(err, reply) {
            console.log("Updated currencies value: " +  reply); 
            });
        });
}