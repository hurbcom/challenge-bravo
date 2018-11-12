const config    = require('config')
const Redis     = require('./services/cache')
const Currency  = require('./services/currency')
const CURRENCY  = new Currency()
const CACHE     = new Redis()

startUpdateRoutine()

/**
 * @description getCurrenciesAndUpdateCache é responsável por buscar os dados da API Open Exchanges Rates e
 * atualizar o banco de dados Redis.
 */
function getCurrenciesAndUpdateCache(){
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
                console.log(`Sem modificação de valores, buscando novamente em: ${config.currencies_cache_time_minutes} minutos`)
            }
        }).catch((e)=>{
            console.log(e)
        })
}

/**
 * @description startUpdateRoutine é responsável pela primeira inicialização dos dados da API OEX
 * e criar uma rotina de atulização baseada no tempo definido no arquivo de configuração.
 */
function startUpdateRoutine(){   
    getCurrenciesAndUpdateCache()
    setInterval(()=> getCurrenciesAndUpdateCache(), config.currencies_cache_time_minutes * 60 * 1000)
}


