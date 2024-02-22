const Redis = require('../services/redis');
const { format2float, formatCurrency } = require('../utils/formatter');

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
            calc = (
                (amount * to) / from
            );
        }

        return formatCurrency(calc, cuurrency);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    ExistsCurrency,
    ConvertCurrency
};
