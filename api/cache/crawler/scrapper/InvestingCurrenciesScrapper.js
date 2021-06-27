const AbstractScrapper = require('./AbstractScrapper');

class InvestingScrapper extends AbstractScrapper{
    constructor(){
        super();
        this.url = 'https://br.investing.com/currencies/exchange-rates-table';
    }

    async scrap(instance){ // crawler que entra no site e recupera a div com as informações
        await super.scrap(instance);

        await this.page.waitForSelector('#pair_12');

        let [usdToBrl, usdToEur] =
                        await Promise.all([this.getCurrency("#last_12_35"), this.getCurrency('#last_12_17')]);

        return {
            BRL: this.processInformation(usdToBrl),
            EUR: this.processInformation(usdToEur)
        };
    }
}

module.exports = InvestingScrapper;