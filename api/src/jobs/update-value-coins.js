const repository = require('@utils/repositories')
const startingCoins = require('@utils/starting-coins')

const getCoins = require('@services/rates-api')

module.exports = async function updateValueCoins() {
    console.log('Started Job')

    console.log('Taking value of coins based on dollars')
    const rates = await getCoins()
    console.log('Values ​​successfully collected')

    var coins = await repository.findAll()
    //Se for a primeira interação utiliza array default criado em utils
    if (!coins.length) {
        console.log('entrei aqui')
        coins = startingCoins
        console.log('Starting coin creation')
    }

    console.log('Starting updates')
    //iteração
    for (let coin of coins) {
        if (coin.name == 'BRL') {
            console.log(`${coin.name} updated successfully`)
            console.log('Saving updates')
            //salvando no mongo
            await repository.updateById(coin.name, rates['USD'].ask)
            console.log('Saved updates')
        } else if (rates[coin.name]) {
            //se a moedas existir no retorno da API Rates, atualiza o valor dela com o valor mais recente
            console.log(`${coin.name} updated successfully`)
            console.log('Saving updates')
            //salvando no mongo
            await repository.updateById(
                coin.name,
                rates[coin.name].ask / rates['USD'].ask
            )
            console.log('Saved updates')
        }
    }
}
