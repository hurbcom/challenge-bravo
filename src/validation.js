const { query, param } = require('express-validator');
const coinConfig = require('./coinConfig');
const storedCoins = coinConfig.adjacentCoins.concat( coinConfig.baseCoin );

module.exports = method => {
    switch(method) {
        case 'convert': {
            return [
                query('from').exists().isIn(storedCoins),
                query('to').exists().isIn(storedCoins),
                query('amount').exists().isNumeric()
            ]
        }
        case 'add':
            return param('id').exists().isString().not().isIn(storedCoins)
        case 'remove':
            return param('id').exists().isString().isIn(storedCoins)
    }
}