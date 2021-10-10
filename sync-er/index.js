const redis = require("./redis_config/cacheConfig");
const getCurrency = require("./currency_api/api");
const currenciesService = require("./service/currencieService");
const syncer = getCurrency()
    .then((data) => {
        
        const currencies = currenciesService(data);

        redis.set("currencies", JSON.stringify(currencies),function(err, reply) {
            console.log("Updated cache: " +  reply); // OK
            });
    });
