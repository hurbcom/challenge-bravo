export default class Currency {
    constructor (CurrencyService) {
        this.CurrencyService = CurrencyService;
    }

    async list (req, res) {
        try {
            const currenciesList = await this.CurrencyService.listSupportedCurrencies();

            return res.sendResponse(200, `success`, currenciesList);
        } catch (err) { 
            return res.sendResponse(500, 'internal server error');
        }
    }
    
    async store (req, res) {
        try {
            const newCurrency = await this.CurrencyService.storeCurrency(req.body);
            
            return res.sendResponse(201, 'success', newCurrency);
        } catch (err) {
            let statusCode = 500;
            let message = 'internal server error';

            if (err.already_registered) {
                statusCode = 400;
                message = 'This currency is already registered'
            }

            return res.sendResponse(statusCode, message);
        }
    }

    delete(req, res) {
        return res.sendResponse(200, `currency ${req.params.symbol} deleted`);
    }
};