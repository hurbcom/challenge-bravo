/** config
 * Creates an object that holds the configuration-related values
 */
require('dotenv').config()

const path = require('path')

const ENV = process.env.NODE_ENV || 'development'
const envConfig = require(path.join(__dirname, 'environments', ENV))

const config = Object.assign({
    env: ENV,
}, envConfig)

module.exports = config