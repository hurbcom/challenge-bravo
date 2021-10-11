const redis = require("../cache_config/redisConfig");


module.exports = (reply, req, convertingRules ) => {
    
    //Update currencies creating new currency element.
    var data = JSON.parse(reply);
    const pairUsd = data[req.body.exchangePairName] * req.body.exchangePairValue;
    data[req.body.currencyName] = pairUsd;
    const insertCurrency = redis.set("currencies", JSON.stringify(data));

    //Update convertingRules creating new convertingRules element.
    var convertingRulesData = JSON.parse(convertingRules);
    convertingRulesData[req.body.currencyName] = {value: req.body.exchangePairValue, pairExchange: req.body.exchangePairName}
    const insertConvertingRule = redis.set("convertingRules", JSON.stringify(convertingRulesData));
    
    return {pairUsd: pairUsd, flag: true};

}