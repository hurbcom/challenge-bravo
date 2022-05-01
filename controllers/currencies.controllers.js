const currenciesRepository = require('../repositories/currencies.repository');

exports.createCurrency = async (req, res) => {
    try {
        await currenciesRepository.createCurrency({
            code: req.body.code,
            fictitious: req.body.fictitious,
            rate: req.body.rate,
        });
        res.status(201).send({ message: 'Successfully registered currency!' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Failed to register place.' });
        }
    }
};
