const fetch = require('node-fetch').default;
const fs = require('fs');
const coinConfig = require('./coinConfig');
const DEFAULT_OPTIONS = {
    baseCoin: coinConfig.baseCoin,
    adjacentCoins: coinConfig.adjacentCoins
}

/**
 * A simplific class to abrigate some basic method for fetching coin info.
 */
class Scrooge {
    /**
     * Creates a new instance of Scrooge coin utility
     * @param {Object} [options] optional parameter to modify or increment the default settings, apiKey can be set.
     */
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
        this.apiUrl = this.options.apiKey ? this.apiUrl + `&api_key=${this.options.apiKey}` : this.apiUrl
    }

    /**
     * Updates the exchange rates of the instance.
     * @returns {Object} updated coin exchange rates
     */
    async fetchUpdates() {
        await fetch(this.apiUrl)
            .then(res => res.text())
            .then(text => JSON.parse(text))
            .then(data => this.exchangeRates = data)
            .catch(error => console.log('Erro: ',error));
        this.exchangeRates[this.options.baseCoin] = 1;

        return this.exchangeRates;
    }

    /**
     * Retrieves the exchange rates and return the conversion between the coins
     * @param {String} from initials of the coin desired to be converted
     * @param {String} to inital of the coin desired to get its output in
     * @param {Number} quantity units of the coin desired to be converted
     */
    async convert(from, to, quantity) {
        return this.fetchUpdates()
            .then(rates => quantity / rates[from] * rates[to])
    }
}

module.exports = Scrooge;