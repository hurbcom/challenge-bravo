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
    
    store (req, res) {
        try {
            const newCurrency = this.CurrencyService.addCurrency(req.body);
            
            return res.sendResponse(201, 'success', newCurrency);
        } catch (err) {
            return res.sendResponse(500, 'internal server error');
        }
    }

    delete(req, res) {
        return res.sendResponse(200, `currency ${req.params.symbol} deleted`);
    }
};