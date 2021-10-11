const redis = require("../cache_config/redisConfig")


module.exports = (req,currenciesData,convertingRulesData) => {
    delete currenciesData[req.query.currencyName];
    const updateExchangePairs = redis.set("currencies", JSON.stringify(currenciesData));

    delete convertingRulesData[req.query.currencyName];
    const updateConvertingRules = redis.set("convertingRules", JSON.stringify(convertingRulesData));
}