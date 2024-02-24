const Redis = require('../services/redis');
const { format2float, formatCurrency } = require('../utils/formatter');
const { CurrencysModel, CurrencysRaw } = require('../models/currencys');

const GetCurrency = async currency => {
    try {
        const result = await Redis.get(currency);
        return result;
    } catch (error) {
        throw new Error(error);   
    }
};

const ConvertCurrency = async (from, to, amount) => {
    try {
        let calc = 0;
        let crypto = from.crypto || to.crypto;

        if (from.currency === to.currency) calc = amount;
        else {
            amount = format2float(amount);

            if(from.ballast_usd > to.ballast_usd) calc = (amount * to.ballast_usd) / from.ballast_usd;
            else calc = (amount * to.ballast_usd) * from.ballast_usd;
        }

        return {
            from: formatCurrency(amount, from.currency, crypto),
            to: formatCurrency(calc, to.currency, crypto)
        }
    } catch (error) {
        throw new Error(error);
    }
};

const NewCurrency = async (currency, ballast_usd, crypto = false) => {
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
            crypto,
            imported: false,
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
        const curr = await CurrencysModel.findOne({
            where: {
                currency: currency.toUpperCase()
            }
        });
        if(!curr) {
            return {
                status: 404,
                message: 'Currency not found'
            };
        }
        if(curr.imported) {
            return {
                status: 403,
                message: 'Not authorized delete default currencies'
            };
        }

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
    GetCurrency,
    ConvertCurrency,
    NewCurrency,
    DeleteCurrency
};
