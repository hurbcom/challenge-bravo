const redis = require('../../../cache/configRedis');
const FakeCoinRepository = require('../../coin/repository/FakeCoinRepository');

class CoinRepository {
    constructor() {
        this.redis = redis;
        this.fakeCoinRepository = new FakeCoinRepository();
    }

    async getCurrency(coin) {
        let coinValue = await this.getRealCoinCurrency(coin);

        if(!coinValue){
            const fakeCoin = await this.getFakeCoinCurrency(coin);
            coinValue = fakeCoin?.currency;
        }

        if(coinValue) return coinValue;

        throw new Error('Moeda não existe para conversão.');
    }

    async getRealCoinCurrency(coin) {
        const coinCotation = await this.redis.get(coin);

        if(coinCotation){
            return parseFloat(coinCotation);
        }

        return;
    }

    async getFakeCoinCurrency(coin){
        return this.fakeCoinRepository.find(coin);
    }

    async getUpdateTime(){
        return this.redis.get('update_time');
    }
      
}


module.exports = CoinRepository;