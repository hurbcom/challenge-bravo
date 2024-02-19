const exchangeRates = {
    USD: {
        USD: 1
    },
    BRL: {
        USD: 0.2016,
    },
    EUR: {
        USD: 1.08,
    },
    BTC: {
        USD: 47619.05,
    },
    ETH: {
        USD: 1538.46,
    },
    ARS: {
        USD: 0.0012
    }
};

exports.ConvertCurrency = (from, to, amount) => {
    from = exchangeRates[from];
    to = exchangeRates[to];
    const calc = (
        (amount * from.USD) / to.USD
    ).toFixed(4);

    const formattedNumber = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(calc);
    return formattedNumber;
};