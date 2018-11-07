const config = require('config')

const Redis = require('./services/cache')
const Currency = require('./services/currency')

const CURRENCY  = new Currency()
const CACHE     = new Redis()

startRoutine()

function startRoutine(){
    // setInterval(()=>{
        CURRENCY.getCurrencyFromOpenExchangesRates().then(async (receivedValues)=>{
            if(CURRENCY.isCurrencyValuesChanged(receivedValues.rates)){
                
                CURRENCY.updateCurrencyValues(receivedValues.rates)

                let currencyKeys = Object.keys(CURRENCY.values)

                for(let key of currencyKeys){
                    try {
                        let key_value = CURRENCY.values[key]
                        await CACHE.setKey(key, key_value)
                    } catch (error) {
                        console.log(error)
                    }
                }
                
                console.log("Cache atualizado com sucesso!")
            } else {
                console.log(receivedValues.rates)
                console.log(`Sem modificação de valores, buscando novamente em: ${config.secondsRefreshCurrencies} segundos`)
            }
        }).catch((e)=>{
            console.log(e)
        })
    // }, config.secondsRefreshCurrencies * 1000)
}


