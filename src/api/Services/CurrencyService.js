const Currency = require('../Models/CurrencyModel');

module.exports = {

    async findAll() {

        const currencies = await Currency.find();
        
        if (currencies[0] == null) {
            throw { msg: "Empty list" };
        }

        return { currencies };
    },

    async create(body) {

        let { currency } = body;
        let currencyUper = currency.toUpperCase();
        let findCurrency = await Currency.findOne({ currency : currencyUper });

        if (findCurrency == null) {
            await Currency.create({
                currency : currencyUper
            })    
            return { "Created currency": currencyUper };
        };
        throw { msg: "Currency already exists" };
    },

    async delete(params) {

        let { id } = params;
        let findId = await Currency.findOne({ _id : id });

        if (findId == null) {
            throw { msg: "Currency not found" };
        }    

        await Currency.findOneAndRemove({ _id : id });

        return { "Deleted currency": id };             
    }

}