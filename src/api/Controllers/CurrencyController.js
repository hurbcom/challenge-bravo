const CurrencyService = require('../Services/CurrencyService');

module.exports = {

    async findAll(req, res) {
        
            try {
                const response = await CurrencyService.findAll();
                return res.status(200).json(response);
            } catch (msg) {
                return res.status(404).json(msg);
            }
        },

    async create(req, res) {

        try {
            const response = await CurrencyService.create(req.body);
            return res.status(201).json(response);
        } catch (msg) {
                return res.status(404).json(msg);
        }
    },

   async delete(req, res) {    
    
        try {
            const response = await CurrencyService.delete(req.params);
            return res.status(200).json(response);
        } catch (msg) {
            return res.status(404).json(msg);
        }
    }
};