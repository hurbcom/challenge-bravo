const { toType } = require('../util')


exports.register = (key, value) => {

    return global.client.set(key, JSON.stringify(value))

}