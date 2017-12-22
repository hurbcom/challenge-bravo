const clients = require('restify-clients');

const APP_ID = 'e75fc20a2b7d479cad31d096fd41427f';

class OxrClient {
    constructor() {
        this._client = clients.createJsonClient({
            url: 'https://openexchangerates.org',
            version: '~1.0'
        });
        this.latest = callback => this._client.get(`/api/latest.json?app_id=${APP_ID}`, callback);
        this.currencies = callback => this._client.get(`/api/currencies.json`, callback);
    }
}

module.exports = () => {
    return OxrClient;
};
