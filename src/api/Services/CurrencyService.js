const CurrencyModel = require('../Models/CurrencyModel');

module.exports = {

    async create(currency) {

        const currencyRecord = await CurrencyModel.create(currency);

        return { currency: currencyRecord };
    },

    async delete(id) {

        const currencyId = await CurrencyModel.delete(id);

        return { currencyId: currencyId };
    }

}