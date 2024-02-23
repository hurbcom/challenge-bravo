const Redis = require('../services/redis');
const { format2float, formatCurrency } = require('../utils/formatter');
const { CurrencysModel, CurrencysRaw } = require('../models/currencys');

const ExistsCurrency = async currency => {
    const exists = await Redis.get(currency);
    return exists ? true : false;
};

const ConvertCurrency = async (from, to, amount, cuurrency = 'USD') => {
    try {

        let calc = 0;

        from = from.toUpperCase();
        to = to.toUpperCase();

        if (from === to) calc = amount
        else {
            amount = format2float(amount);
            from = await Redis.get(from);
            to = await Redis.get(to);

            if(from > to) calc = (amount * to) / from;
            else calc = (amount * to) * from;
        }

        return formatCurrency(calc, cuurrency);
    } catch (error) {
        throw new Error(error);
    }
};

const NewCurrency = async (currency, ballast_usd) => {
    const transaction = await CurrencysRaw.transaction();
    try {

        let existCurrency = await CurrencysModel.findOne({ where: { currency: currency.toUpperCase() } });
        if (existCurrency) {
            return {
                status: 409,
                message: 'Currency already exists'
            };
        }

        await CurrencysModel.create({ 
            currency: currency.toUpperCase(), 
            ballast_usd: ballast_usd, 
            createdAt: new Date(), 
            updatedAt: new Date() 
        }, { transaction });
        
        await Redis.set(currency, ballast_usd);
        
        await transaction.commit();
        
        return {
            status: 201,
            message: 'Currency created successfully'
        };
    } catch (error) {
        await transaction.rollback();
        throw new Error(error);
    }
};

const DeleteCurrency = async currency => {
    const transaction = await CurrencysRaw.transaction();
    try {
        await CurrencysModel.destroy({ where: { currency: currency.toUpperCase() }, transaction });
        await Redis.set(currency, 0, 1);
        await transaction.commit();
        return {
            status: 200,
            message: 'Currency deleted successfully'
        };
    } catch (error) {
        await transaction.rollback();
        throw new Error(error);
    }
};

module.exports = {
    ExistsCurrency,
    ConvertCurrency,
    NewCurrency,
    DeleteCurrency
};
