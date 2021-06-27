const redis = require('../../../cache/configRedis');
class CoinRepository {
    constructor() {
        this.redis = redis;
    }

    async getCurrency(coin) {
        return this.getRealCoinCurrency(coin);
    }

    async getRealCoinCurrency(coin) {
        const coinCotation = await this.redis.get(coin);

        if(coinCotation){
            return parseFloat(coinCotation);
        }

        return;
    }

    async getFakeCoinCurrency(coin){
        return {
            hurb: 0.01
        }
    }
      
}


module.exports = CoinRepository;