const baseCoins = require('@utils/coin-base.json')
module.exports = (req, res)=> {
    const {from, to, amount} = req.query
    if (Object.keys(baseCoins).includes(from) && Object.keys(baseCoins).includes(to) ){
        const dollarValueBase = parseFloat(amount) / parseFloat(baseCoins[from])
        const convertedValue = String(dollarValueBase * parseFloat(baseCoins[to]))
        res.json({convertedValue, message: `Os valores que serviram como base de calculo foram pegos em: ... e sua ultima atualização ocorreu em: ...`})
    } else res.json({convertedValue: null, message:`Valores não encontrado no banco de moedas`})

}