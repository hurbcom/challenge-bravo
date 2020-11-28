const currencyService = require('../services/currencyService');
const converterService = require('../services/converterService');

module.exports = {

// Lista todos os planetas armazenados
    async index (req, res) {
        try {
            const response = await currencyService.index();
            return res.status(200).json(response);
        } catch (err) {
            return res.status(404).json(err);
        }
    },

// Armazenar novos planetas
    async new (req, res) {
        try {
            const response = await currencyService.new();
            return res.status(200).json(response);
        } catch (err) {
            return res.status(404).json(err);
        }
    }
}
