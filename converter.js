const fetch = require('node-fetch')
const quote = {}

const update_quote = async () => {
    console.log('Updating quotation.')
    try{
        let address = 'http://api.promasters.net.br/cotacao/v1/valores'
        let result = await fetch(address, {method: 'get'})
        let json = await result.json()
        for (let key of Object.keys(json.valores)){
            quote[key] = json.valores[key].valor
        }
    } catch (e) {
        console.log(e.message, e.stack)
    }
    
}

update_quote()
setInterval(update_quote, 15000)

const converter = (from, to, amount) => {
    return quote[from]
}

module.exports = converter