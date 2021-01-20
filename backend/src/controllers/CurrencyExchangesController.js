const CurrencyExchangeService = require('../services/CurrencyExchangeService');

class CurrencyExchangesController {
    async index(req, res) {
        const currencyExchangeExchanges = await CurrencyExchangeService.all();

        return res.json(currencyExchangeExchanges);
    }

    async show(req, res) {
        const { symbol } = req.params;
        const currencyExchange = await CurrencyExchangeService.findByBaseSymbol(symbol);

        return res.json(currencyExchange);
    }

    async convert(req, res) {
        const { from, to, amount = 0 } = req.query;
        const currencyConverted = await CurrencyExchangeService.converter(from, to, amount);

        return res.json(currencyConverted);
    }

    async store(req, res) {
        const { body } = req;
        const currencyExchange = await CurrencyExchangeService.create(body);

        return res.send({ currencyExchange });
    }

    async destroy(req, res) {
        const { symbol } = req.params;
        await CurrencyExchangeService.delete(symbol);

        return res.send();
    }
}

module.exports = new CurrencyExchangesController();