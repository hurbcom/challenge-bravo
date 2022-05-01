const currenciesRepository = require('../repositories/currencies.repository');
const exchangesService = require('../services/exchanges.services');

exports.convert = async (req, res) => {
    try {
        const { from, to } = req.query;

        const amount = Number.parseFloat(req.query.amount);

        const fromCurrency = await currenciesRepository.retrieveCurrencyByCode(from);

        if (!fromCurrency) {
            return res.status(404).send({ message: `No currency found for code '${from}'.` });
        }

        const toCurrency = await currenciesRepository.retrieveCurrencyByCode(to);

        if (!toCurrency) {
            return res.status(404).send({ message: `No currency found for code '${to}'.` });
        }

        const result = exchangesService.convert(fromCurrency, toCurrency, amount);

        return res.status(200).send({
            from: {
                code: from,
                amount: amount.toFixed(2),
            },
            to: {
                code: to,
                amount: result.toFixed(2),
            },
        });
    } catch (error) {
        return res.status(500).send({ message: 'Failed to calculate exchange.' });
    }
};
