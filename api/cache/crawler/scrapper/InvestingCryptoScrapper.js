const AbstractScrapper = require('./AbstractScrapper');

class InvestingCryptoScrapper extends AbstractScrapper {
    constructor() {
        super();
        this.url = 'https://br.investing.com/crypto/';
    }

    async scrap(instance) { // crawler que entra no site e recupera a div com as informações
        await super.scrap(instance);

        const [bitcoin, ethereum] = await Promise.all([this.getCurrency("[i='1057391'] > .price > a"), 
                                                            this.getCurrency("[i='1061443'] > .price > a")]);

        return {
            BTC: this.processInformation(bitcoin),
            ETH: this.processInformation(ethereum)
        };
    }
}

module.exports = InvestingCryptoScrapper;