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

const convertCurrency = (from, to, amount) => {
    const currency = to;
    from = exchangeRates[from];
    to = exchangeRates[to];
    const calc = (
        (amount * to.USD) / from.USD
    ).toFixed(4);

    const formattedNumber = new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(calc);

    return formattedNumber;
};


console.log(convertCurrency('USD', 'USD', 100));
console.log(convertCurrency('USD', 'BRL', 1));
console.log(convertCurrency('USD', 'EUR', 100));
console.log(convertCurrency('USD', 'BTC', 100));
console.log(convertCurrency('USD', 'ETH', 100));

console.log(convertCurrency('BRL', 'EUR', 1));
console.log(convertCurrency('EUR', 'BRL', 1));

console.log(convertCurrency('BRL', 'ARS', 1));
console.log(convertCurrency('ARS', 'BRL', 1));