const CurrenciesService = require('../services/currenciesService');

class CurrenciesController {
    async addCurrency(req, res) {
        const { currency } = req.body;
        const response = await CurrenciesService.addCurrency({ currency });
        return res.status(201).json({
            result: true,
            message: 'Currency added',
            data: {
                id: response.insertedId,
                currencyCode: currency
            }
        });
    }

    async getCurrencies(req, res) {
        const response = await CurrenciesService.readCurrencies();
        return res.status(200).json({
            result: true,
            message: 'System currencies available list',
            data: response,
        });
    }

    async deleteCurrency(req, res) {
        const { currency } = req.params;
        const response = await CurrenciesService.deleteCurrency({ currency });
        if (!response.deletedCount) {
            return res.status(404).json({
                result: false,
                message: 'Currency not found',
            });
        }
        return res.status(200).json({
            result: true,
            message: 'Currency deleted',
        });
    }

    async getConversion(req, res) {
        const { from, to, amount } = req.query;
        const response = await CurrenciesService.getConversion(from, to, amount);
        return res.status(200).json({
            result: true,
            message: 'Conversion executed',
            data: {
                from_currency: from,
                from_amount: amount,
                to_currency: to,
                to_amount: response,
            }
        });
    }
}

module.exports = new CurrenciesController();
