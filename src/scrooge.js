const DEFAULT_OPTIONS = {
    baseCoin: 'USD',
    adjacentCoins: ['BTC', 'ETH', 'EUR', 'BRL' ]
}

class Scrooge {
    constructor(options) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options
        }
        this.apiUrl = `https://min-api.cryptocompare.com/data/price?fsym=${options.baseCoin}&tsyms=${options.adjacentCoins.join()}`
        this.exchangeRates = {};
        this.fetchUpdates();
    }

    fetchUpdates() {
        fetch(this.apiUrl)
            .then(json => JSON.parse(json))
            .then(response => this.exchangeRates = response);
    }

    get exchangeRates() {
        return this.exchangeRates();
    }

}

module.exports = Scrooge;