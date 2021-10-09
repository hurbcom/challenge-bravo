const redis = require("./redis_config/cacheConfig");
const getCurrency = require("./currency_api/api");

const syncer = getCurrency()
    .then((data) => {
        
        const currencies = {
            USDUSD: 1,
            BRLUSD: data.BRLUSD.bid,
            EURUSD: data.EURUSD.bid,
            BTCUSD: data.BTCUSD.bid,
            ETHUSD: data.ETHUSD.bid,
            BRLBRL: 1,
            USDBRL: data.USDBRL.bid,
            EURBRL: data.EURBRL.bid,
            BTCBRL: data.BTCBRL.bid,
            ETHBRL: data.ETHBRL.bid,
            EUREUR: 1,
            USDEUR: data.USDEUR.bid,
            BRLEUR: data.BRLEUR.bid,
            BTCEUR: data.BTCEUR.bid,
            ETHEUR: data.ETHEUR.bid,
            //Como as criptoes não possuem cotação na api, é necessário fazer uma manipulação.
            BTCBTC: 1,
            USDBTC: 1/data.BTCUSD.bid,
            BRLBTC: 1/data.BTCBRL.bid,
            EURBTC: 1/data.BTCEUR.bid,
            ETHBTC: data.ETHUSD.bid/data.BTCUSD.bid,
            ETHETH: 1,
            USDETH: 1/data.ETHUSD.bid,
            BRLETH: 1/data.ETHBRL.bid,
            EURETH: 1/data.ETHEUR.bid,
            BTCETH: data.BTCUSD.bid/data.ETHUSD.bid
        }

        redis.set("currencies", JSON.stringify(currencies),function(err, reply) {
            console.log("Updated cache: " +  reply); // OK
            });
    });
