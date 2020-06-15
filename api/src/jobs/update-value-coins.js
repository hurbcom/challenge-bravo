const repository = require('@utils/repositories')
const getCoins = require('@services/rates-api')

module.exports = async function updateValueCoins() {
    console.log('Started Job')

    console.log('Taking value of coins based on dollars')
    const { rates } = await getCoins()
    console.log('Values ​​successfully collected')

    const coins = await repository.findAll()

    console.log('Starting updates')
    for (let coin of coins) {
        if (rates[coin.name]) {
            console.log(`${coin.name} updated successfully`)
            console.log('Saving updates')
            await repository.updateById(coin.name, rates[coin.name])
            console.log('Saved updates')
        }
    }
}
