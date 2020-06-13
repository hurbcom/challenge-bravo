const fs = require('fs')
module.exports = function updateJson(json) {
    let message
    try {
        fs.writeFileSync('src/utils/coin-base.json', json)
        return (message = `Success`)
    } catch (err) {
        return (message = `Fatal error: ${err.message}`)
    }
}
