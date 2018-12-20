import acceptedCurrencies from '../data/accepted-currencies.json';
import log from '../services/logger.service';
import { getExchangeRate } from '../services/quotation-of-the-day.service';

const calculateExchange = (from, to, amount) => {
    if (from <= 0 || to <= 0 || amount <= 0) {
        log(3, 'currency-conversion.controller.js', 'calculateExchange()');
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
        const e = { error: true, message: 'Bad request: missing paramentreo FROM in query' };
        log(3, 'currency-conversion.controller.js', `${e.message}`);
        res.statusCode = 417;
        res.send(e);
        return false;
    };

    if (!to) {
        const e = { error: true, message: 'Bad request: missing paramentreo TO in query' };
        log(3, 'currency-conversion.controller.js', `${e.message}`);
        res.statusCode = 417;
        res.send(e);
        return false;
    };

    from = from.toUpperCase();
    if (!accept.includes(from)) {
        const e = { error: true, message: `The ${from} currency sent to conversion is not accepted. Use one of the following currencies: ${acceptedCurrencies.accept.join()}` };
        log(3, 'currency-conversion.controller.js', `${e.message}`);
        res.statusCode = 404;
        res.send(e);
        return false;
    }

    to = to.toUpperCase();
    if (!accept.includes(to)) {
        const e = { error: true, message: `The ${to} currency sent to conversion is not accepted. Use one of the following currencies: ${acceptedCurrencies.accept.join()}` };
        log(3, 'currency-conversion.controller.js', `${e.message}`);
        res.statusCode = 404;
        res.send(e);
        return false;
    }

    if (!amount) {
        const e = { error: true, message: 'Bad request: missing paramentreo AMOUNT in query' };
        log(3, 'currency-conversion.controller.js', `${e.message}`);
        res.statusCode = 417;
        res.send(e);
        return false;
    };

    amount = parseFloat(amount);
    if (!amount || amount < 0) {
        const e = { error: true, message: 'Bad request: AMOUNT must be a number and greater than zero' };
        log(3, 'currency-conversion.controller.js', `${e.message}`);
        res.statusCode = 417;
        res.send(e);
        return false;
    }

    const rate = await getExchangeRate(process.env.EXCHANGE_RATE_PATH);

    if (rate.error) {
        log(3, 'currency-conversion.controller.js', `${rate.message}`);
        res.statusCode = 503;
        res.send(rate.message);
        return false;
    }

    const exchangeResult = calculateExchange(rate[`${from}`], rate[`${to}`], amount);

    if (exchangeResult.error) {
        log(3, 'currency-conversion.controller.js', 'calculateExchange()');
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
