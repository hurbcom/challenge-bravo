const CurrencyService = require('../services/CurrencyService');

class CurrenciesController {
    async index(req, res) {
        const currencies = await CurrencyService.all();

        return res.json(currencies);
    }

    async show(req, res) {
        const { symbol } = req.params;
        const currency = await CurrencyService.findBySymbol(symbol);

        return res.json(currency);
    }

    async store(req, res) {
        const { body } = req;
        const currency = await CurrencyService.create(body);

        return res.send({ currency });
    }

    async update(req, res) {
        const { symbol } = req.params;
        const { body } = req;
        const currency = await CurrencyService.update(symbol, body);

        return res.send(currency);
    }

    async destroy(req, res) {
        const { symbol } = req.params;
        await CurrencyService.delete(symbol);

        return res.send();
    }
}

module.exports = new CurrenciesController();