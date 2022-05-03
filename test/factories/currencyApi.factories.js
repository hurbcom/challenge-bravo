exports.generateRates = () => ({
    USD: 1,
    BRL: 4.5,
    TEST: 2.85,
    EUR: 5.89,
});

exports.generateApiResponse = () => ({
    data: {
        usd: {
            usd: 1,
            brl: 4.5,
            eur: 5.89,
        },
    },
});
