const Coin = require('../schemas/Coin');

class CoinController {
    async index(req, res) {
        const coins = await Coin.find();
        return res.send(coins);
    }
    async store(req, res) {
        const { code, name, value } = req.body;
        const coin = await Coin.create({
            code,
            name,
            value
        });
        return res.json(coin);

    }
    async update(req, res) {

    }
    async delete(req, res) {

    }
    async conversion(req, res) {

    }
}

module.exports = new CoinController;