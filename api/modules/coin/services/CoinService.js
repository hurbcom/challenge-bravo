const CoinRepository = require('../repository/CoinRepository');
class CoinService {
    constructor() {
        this.coinRepository = new CoinRepository();
    }

    isMainCoin(coin){
        return coin === 'usd';
    }

    async conversion(from, to, amount) {
        if(this.isMainCoin(from) && this.isMainCoin(to)){
           return amount;
        }

        if(this.isMainCoin(from)){
            const toCotation = await this.coinRepository.getCurrency(to);
            return (1/toCotation) * amount;
         }

         if(this.isMainCoin(to)){
            const fromCotation = await this.coinRepository.getCurrency(from);
            return fromCotation * amount;
         }

         const fromCotation = await this.coinRepository.getCurrency(from);
         const toCotation = await this.coinRepository.getCurrency(to);

         return fromCotation * toCotation * amount;
    }
}


module.exports = CoinService;