const coin = require('../models/coin');

module.exports = {
    convert: async (req, res) => {
        const { from, to, amount } = req.query;

        // Resultado da conversão realizada pelo model
        // através da utilização da API do cryptocompare
        const result = await coin.convert(from, to, amount);

        // Caso não haja resultado, algum problema deve ter
        // ocorrido na requisição ao cryptocompare
        if (!result) {
            return res.status(500).json({ message: 'An error occurred' });
        }

        return res.json({ from, to, amount, result });
    }
};
