const {URL_CURRENCIES,APY_KEY} = process.env
const axios = require('axios');
const CurrenciesService = require('../services/CurrenciesService')

// vai na API e pega as moedas que ela tem registradas
const getCurrencies = async ()=>{
    try {
        const response = await axios.get(URL_CURRENCIES+'/supported-currencies');
        return Promise.resolve(response)
    } catch (error) {
        return Promise.reject(error.response.data)
    }

}

// popula o banco com as opções vindas da API
const populate = async(currencies)=>{
    currencies.forEach(async (currencyLocal,key) => {
        const {currencyName,currencyCode,icon}=currencyLocal
        try {
            const curencyReturn = await CurrenciesService.create({
                name:currencyName,
                code:currencyCode,
                icon:icon,
                fictional:false
            })
        } catch (error) {
            return false
        }
    });
    return Promise.resolve({amount:currencies.length})

}
// pega as ultimas leituras de valores da API
const getCurrenciesValues = async ()=>{
    try {
        const response = await axios.get(URL_CURRENCIES+'/latest?apikey='+APY_KEY);
        return Promise.resolve(response.data)
    } catch (error) {
        return Promise.reject(error.response.data)
    }

}
//encontra as moedas pelo seu código e coloca os valores atuais
const populateValues = async(currencies)=>{
    const allCurrencies = currencies.rates
    Object.entries(allCurrencies).map(async(currencyLocal) => {
        const currency = await CurrenciesService.findOneByCode(currencyLocal[0]);
        if(currency){
            const updated = await CurrenciesService.updateValue(currencyLocal[0],currencyLocal[1])
        }
    })
}

const IntegrationService = {getCurrencies,populate,getCurrenciesValues,populateValues}

// exporta as funções do service
module.exports = IntegrationService