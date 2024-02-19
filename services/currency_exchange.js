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

exports.ExistsCurrency = (currency) => {
    return Object.keys(exchangeRates).includes(currency.toUpperCase());
};

exports.ConvertCurrency = (from, to, amount) => {
    let calc = 0;

    from = from.toUpperCase();
    to = to.toUpperCase();

    if(from === to) calc = amount
    else {
        from = exchangeRates[from];
        to = exchangeRates[to];
        calc = (
            (amount * from.USD) / to.USD
        ).toFixed(4);
    }

    const formattedNumber = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(calc);
    return formattedNumber;
};