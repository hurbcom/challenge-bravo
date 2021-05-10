const {Currency} = require('../models')

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

const updateValue = async(code,value)=>{
    let local = await Currency.findOne({ where: {code:code} })
    return await local.update({value:value})
}

const transform = (valor1,valor2,amount) =>{
    return (valor2/valor1) * amount
}

const CurrenciesService ={create,findAll,findOneByCode,updateValue,transform}

module.exports = CurrenciesService