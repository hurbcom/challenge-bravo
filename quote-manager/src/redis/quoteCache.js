const { toType } = require('../util')


exports.register = (key, value) => {
    switch (toType(value)) {
        case 'string':
            return global.client.set(key, value)
        default:
            return global.client.set(key, JSON.stringify(value))
    }
}