const getCoins = require('@services/rates-api')
const baseCoins = require('@utils/coin-base.json')
const updateJson = require('@utils/update-json.js')

module.exports = async function updateValueCoins() {
    console.log('Started Job')

    console.log('Taking value of coins based on dollars')
    const { rates } = await getCoins()
    console.log('Values ​​successfully collected')

    console.log('Starting updates')
    for (let coin of Object.keys(baseCoins)) {
        if (rates[coin]) {
            console.log(`${coin} updated successfully`)
            baseCoins[coin].value = String(rates[coin])
            baseCoins[coin].lastUpdate = String(new Date().toLocaleString())
        }
    }
    console.log('Saving updates')
    await updateJson(JSON.stringify(baseCoins))
    console.log('Saved updates')
}
