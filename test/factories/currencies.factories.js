exports.generateCurrency = (code = 'CODE', rate = 1) => ({
    code, rate,
});

exports.generateCurrencyList = () => [
    {
        code: 'USD',
        rate: 1,
    },
    {
        code: 'BRL',
        rate: 4.50,
    },
    {
        code: 'EUR',
        rate: 6.20,
    },
];
