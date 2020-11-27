const { getObjectId } = require('mongo-seeding');

const DEFAULT_CURRENCIES = [
    'USD',
    'BRL',
    'EUR',
    'BTC',
    'ETH'
];

module.exports = DEFAULT_CURRENCIES.map(currency => {
    return { 
        _id: getObjectId(currency),
        currency: currency 
    }
});