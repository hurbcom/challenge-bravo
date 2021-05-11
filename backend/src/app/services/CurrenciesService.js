const {Currency} = require('../models')
var Formater = require('date-fns')
require("dotenv").config({
    path: ".env"
});

const create = async(obj)=>{
    try {
        const currency = Currency.create(obj)
        return Promise.resolve(currency)
    } catch (error) {
        return Promise.reject(new Error("Currency already exists")).then(resolved, rejected);
    }
}

const findAll = async(obj)=>{
    return await Currency.findAll()
}

const findOneByCode = async(code)=>{
    const currency = await Currency.findOne({ where: {code:code} })
    if(!currency){
        return Promise.reject("No currency find")
    }
    return Promise.resolve(currency)
}

const findById = async(id)=>{
    const currency = await Currency.findByPk(id)
    if(!currency){
        return Promise.reject("No currency find")
    }
    return Promise.resolve(currency)
}

const patch = async(currency,att)=>{
    return await currency.update(att)
}

const deleteCurrency = async(currency)=>{
    return await currency.destroy()
}

const updateValue = async(code,value)=>{
    let local = await Currency.findOne({ where: {code:code} })
    return await local.update({value:value})
}

const transform = (valor1,valor2,amount) =>{
    return (valor2/valor1) * amount
}


const getHealthInfo = async ()=>{
    const{ INTERVALO } = process.env
    const controladora = Formater.sub(new Date(), {hours:INTERVALO})
    try {
        let local = await Currency.min("updatedAt",{where:{fictional:false}})
        let unHealthy = Formater.isBefore(local, controladora)
        if(unHealthy){
            return true
        }
        return false
    } catch (error) {
        return false
    }
}

const CurrenciesService ={create,findAll,findOneByCode,updateValue,transform,findById,patch,deleteCurrency,getHealthInfo}

module.exports = CurrenciesService