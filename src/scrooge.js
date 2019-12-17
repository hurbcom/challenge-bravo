const ScroogeError = require('./error');
const fetch = require('node-fetch').default;
const DEFAULT_OPTIONS = {
    baseCoin: 'USD',
    adjacentCoins: ['BTC', 'ETH', 'EUR', 'BRL' ]
}

class Scrooge {
    constructor(options) {
        this.exchangeRates = {};
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options
        }
        let parameter = 
            Array.isArray(this.options.adjacentCoins) ?
                this.options.adjacentCoins.join() :
                this.options.adjacentCoins;
        this.apiUrl = `https://min-api.cryptocompare.com/data/price?fsym=${this.options.baseCoin}&tsyms=${parameter}`
    }

    async fetchUpdates() {
        await fetch(this.apiUrl)
            .then(res => res.text())
            .then(text => JSON.parse(text))
            .then(data => this.exchangeRates = data)
            .catch(error => console.log('Erro: ',error));
        this.exchangeRates[this.options.baseCoin] = 1;

        return this.exchangeRates;
    }

    async convert(quantity, from, to) {
        return this.fetchUpdates()
            .then(rates => quantity / rates[from] * rates[to])
    }
}

module.exports = Scrooge;