const redis = require("./redis_config/cacheConfig");
const getCurrency = require("./currency_api/api");
const currenciesService = require("./service/currencieService");
const cron = require('node-cron');
const { sync } = require("./redis_config/cacheConfig");
const updateCurrenciesService = require("./service/updateCurrenciesService");
const createCurrenciesService = require("./service/createCurrenciesService");


const syncer = () => {
    getCurrency()
        .then((data) => {
            //Creating USDUSD to return trivial context
            data["USDUSD"] = {code: "USD", codeIn: "USD", bid: 1};
            redis.get("currencies", (err, reply) => {
                const jsonData = JSON.parse(reply);
                console.log(jsonData);

                if(err) console.log(err)
                if(jsonData){
                    //Since there is data, update its value.
                    const updateCurrencies = updateCurrenciesService(reply,data,jsonData);
                    
                }else{
                    //If the redis key "Currencies" is empty, create the keys: currencies and convertionRules..
                    const createCurrencies = createCurrenciesService(reply,data); 
                }
            })
        });
    }
syncer();


cron.schedule('30 * * * * *', function() {
    //Log
    const timeElapsed = Date.now();
    const time = new Date(timeElapsed);
    console.log('Fetching currency data on ' + time.toUTCString());
    syncer();
});
