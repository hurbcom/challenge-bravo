const CoinExchangeService = require('../service/coinExchangeService');

class CoinExchangesController {
    async index(req, res) {
        try {
            const coinExchange = await CoinExchangeService.all();

            return res.json(coinExchange);
        } catch (err) {
            res.sendError('Internal server error GENERIC ERRO - Verifique o log', err);

        }

    }

    async show(req, res) {
        try {
            const { to } = req.params;
            const coinExchange = await CoinExchangeService.findByBaseSymbol(to);
    
            return res.json(coinExchange);
        } catch (err) {
            res.sendError('Internal server error GENERIC ERRO - Verifique o log', err);

        }

    }

    async convert(req, res) {
       try {
        const { from, to, amount = 0 } = req.query;
        const coinExchange = await CoinExchangeService.converter(from, to, amount);

        return res.json(coinExchange);
       } catch (err) {
        res.sendError('Internal server error GENERIC ERRO - Verifique o log', err);

       }

    }

    async create(req, res) {
        try {
            const { body } = req;
            const coinExchange = await CoinExchangeService.create(body);
    
            return res.send({ coinExchange });
        } catch (err) {
            res.sendError('Internal server error GENERIC ERRO - Verifique o log', err);

        }

    }

    async delete(req, res) {
      try {
        const { to } = req.params;
        await CoinExchangeService.delete(to);

        return res.send();
      } catch (err) {
        res.sendError('Internal server error GENERIC ERRO - Verifique o log', err);

      }

    }
}

module.exports = new CoinExchangesController();