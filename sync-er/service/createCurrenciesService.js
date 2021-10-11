const convertingRulesService = require("./convertingRulesService");
const redis = require("../redis_config/cacheConfig");
const currenciesService = require("./currencieService")

module.exports = (reply, data) => {
    const currencies = currenciesService(data);
    const convertingRules = convertingRulesService(data);
    
    redis.set("currencies", JSON.stringify(currencies),function(err, reply) {
        console.log("Created default currencies: " +  reply); 
        });

    redis.set("convertingRules", JSON.stringify(convertingRules),function(err, reply) {
        console.log("Created default convertingRules: " +  reply); 
        });
}