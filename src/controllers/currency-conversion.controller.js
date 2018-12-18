import acceptedCurrencies from '../data/accepted-currencies.json';
import { getExchangeRate } from '../services/quotation-of-the-day.service';

const calculateExchange = (from, to, amount) => {
    if (from <= 0 || to <= 0 || amount <= 0) {
        return {
            error: true,
            convertedValue: '0',
        };
    }

    const amountUSD = (amount / from);
    const amountTo = (amountUSD * to).toFixed(2);
    return {
        error: false,
        convertedValue: amountTo,
    };
};

const convert = async (req, res) => {
    let { from, to, amount } = req.query;
    const { accept } = acceptedCurrencies;

    if (!from) {
        res.statusCode = 417;
        res.send({ error: true, message: 'Bad request: missing paramentreo FROM in query' });
        return false;
    };

    if (!to) {
        res.statusCode = 417;
        res.send({ error: true, message: 'Bad request: missing paramentreo TO in query' });
        return false;
    };

    from = from.toUpperCase();
    if (!accept.includes(from)) {
        res.statusCode = 404;
        res.send({ error: true, message: `The ${from} currency sent to conversion is not accepted. Use one of the following currencies: ${acceptedCurrencies.accept.join()}` });
        return false;
    }

    to = to.toUpperCase();
    if (!accept.includes(to)) {
        res.statusCode = 404;
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

    const rate = await getExchangeRate('src/data/exchange-rate.json');

    const exchangeResult = calculateExchange(rate[`${from}`], rate[`${to}`], amount);

    if (exchangeResult.error) {
        res.statusCode = 503;
        res.send(exchangeResult.error);
        return false;
    }

    const conversion = {
        error: false,
        updateDate: rate.updateDate,
        amountToBeConverted: amount,
        from,
        to,
        convertedValue: exchangeResult.convertedValue,
    };

    res.json(conversion);
    return true;
};

export { convert, calculateExchange };
