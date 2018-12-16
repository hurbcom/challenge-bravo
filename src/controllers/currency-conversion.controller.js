import exchangeate from '../data/exchange-rate.json';
import acceptedCurrencies from '../data/accepted-currencies.json';

const calculateExchange = (from, to, amount) => {
    const amountUSD = (amount / from);
    const amountTo = (amountUSD * to).toFixed(2);
    const result = {
        error: false,
        convertedValue: amountTo,
    };

    return result;
};

const convert = async (req, res) => {
    let { from, to, amount } = req.query;
    const { accept } = acceptedCurrencies;

    if (!from) {
        res.statusCode = 417;
        res.send({ error: true, message: 'Bad request: missing paramentreo FROM in query' });
        return false;
    };
    from = from.toUpperCase();

    if (!to) {
        res.statusCode = 417;
        res.send({ error: true, message: 'Bad request: missing paramentreo TO in query' });
        return false;
    };
    to = to.toUpperCase();

    if (!accept.includes(from)) {
        res.statusCode = 417;
        res.send({ error: true, message: `The ${from} currency sent to conversion is not accepted. Use one of the following currencies: ${acceptedCurrencies.accept.join()}` });
        return false;
    }

    if (!accept.includes(to)) {
        res.statusCode = 417;
        res.send({ error: true, message: `The ${to} currency sent to conversion is not accepted. Use one of the following currencies: ${acceptedCurrencies.accept.join()}` });
        return false;
    }

    if (!amount) {
        res.statusCode = 417;
        res.send({ error: true, message: 'Bad request: missing paramentreo AMOUNT in query' });
        return false;
    };

    amount = parseFloat(amount);
    if (!amount || amount < 0) {
        res.statusCode = 417;
        res.send({ error: true, message: 'Bad request: AMOUNT must be a number and greater than zero' });
        return false;
    }

    const exchangeResult = calculateExchange(exchangeate[`${from}`], exchangeate[`${to}`], amount);

    if (exchangeResult.error) {
        res.statusCode = 417;
        res.send(exchangeResult.error);
        return false;
    }

    const conversion = {
        error: false,
        updateDate: exchangeate.updateDate,
        amountToBeConverted: amount,
        from,
        to,
        convertedValue: exchangeResult.convertedValue,
    };

    res.json(conversion);
    return true;
};

export { convert as default };
