const Redis = require('./services/redis')
const Currency = require('./services/currency')

const CURRENCY  = new Currency()
const CACHE     = new Redis()

startRoutine()

function startRoutine(){
    // setTimeout(()=>{
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

            } else {
                console.log(`Sem modificação de valores, buscando novamente em: ${config.minutesRefreshCurrencies}`)
            }
        }).catch((e)=>{
            console.log(e)
        })
    // }, config.minutesRefreshCurrencies)
}


