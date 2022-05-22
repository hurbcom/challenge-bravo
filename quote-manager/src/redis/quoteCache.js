const CONST = require('../properties')


exports.registerQuotation = (coinName, quotations) => {
    return global.client.set(coinName, JSON.stringify(quotations))
}