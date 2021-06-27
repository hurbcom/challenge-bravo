const CoinRepository = require('../repository/CoinRepository');
class ExchangeService {
    constructor() {
        this.coinRepository = new CoinRepository();
    }

    isMainCoin(coin){
        return coin === 'USD';
    }

    async conversion(from, to, amount) {
        if(to === from){
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


module.exports = ExchangeService;