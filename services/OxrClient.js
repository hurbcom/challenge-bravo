var clients = require('restify-clients');

const APP_ID = 'e75fc20a2b7d479cad31d096fd41427f';

function OxrClient() {
    this._client = clients.createJsonClient({
        url: 'https://openexchangerates.org',
        version: '~1.0'
    });
}

OxrClient.prototype.latest = function (callback) {
    this._client.get(`/api/latest.json?app_id=${APP_ID}`, callback);
}

module.exports = function () {
    return OxrClient;
};
