
const CoinService = require('../service/coinService');


class CoinController {
    async index(req, res) {
        try {
            const coins = await CoinService.all();

            return res.json(coins);
        } catch (err) {
            res.sendError('Internal server error GENERIC ERRO - Verifique o log', err);
        }

    }

    async show(req, res) {
        try {
            const { to } = req.params;
            const coin = await CoinService.findBySymbol(to);
    
            return res.json(coin);
            
        } catch (err) {
            res.sendError('Internal server error GENERIC ERRO - Verifique o log', err);
        }

    }

    async create(req, res) {
       try {
        const { body } = req;
        const coin = await CoinService.create(body);

        return res.send({ coin });
       } catch (err) {
        res.sendError('Internal server error GENERIC ERRO - Verifique o log', err);
       }
 
    }

    async update(req, res) {
       
       try {
        const { to } = req.params;
        const { body } = req;
        const coin = await CoinService.update(to, body);

        return res.send(coin);
       } catch (err) {
        res.sendError('Internal server error GENERIC ERRO - Verifique o log', err);
       }

    }

    async delete(req, res) {
        try {
            const { to } = req.params;
            await CoinService.delete(to);
    
            return res.send(); 
        } catch (err) {
            res.sendError('Internal server error GENERIC ERRO - Verifique o log', err);

        }

    }
}

module.exports = new CoinController();