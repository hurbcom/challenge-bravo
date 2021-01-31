const { convertAmount } = require('../helpers/currencyHelpers');

class CurrencyController {
    async convert(req, res) {
        const { from, to, amount } = req.query;
        try {
            const convertedValue = await convertAmount(from, to, amount);
            return res.json({ "value" : convertedValue });    
        } catch (e) {
            return res.status(400).json({ "message" : e.message });
        }
    }
}

module.exports  = new CurrencyController();