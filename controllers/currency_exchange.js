const Redis = require('../services/redis');
const { format2float, formatCurrency, useCryptoFormat } = require('../utils/formatter');
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
        crypto = typeof crypto === 'boolean' ? crypto : crypto === 'true';

        if (from.currency === to.currency) calc = amount;
        else {
            amount = format2float(amount, from.crypto);

            const amountIdUSD = amount / from.ballast_usd;
            calc = amountIdUSD * to.ballast_usd;
        }

        return {
            from: formatCurrency(amount, from.currency, useCryptoFormat(amount, from.crypto)),
            to: formatCurrency(calc, to.currency, useCryptoFormat(calc, to.crypto))
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
        
        await Redis.set(currency, JSON.stringify(
            { 
                currency: currency.toUpperCase(),
                ballast_usd,
                crypto
            }
        ));
        
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
