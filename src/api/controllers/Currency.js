export default class Currency {
    constructor (CurrencyService) {
        this.CurrencyService = CurrencyService;
    }

    async list (req, res) {
        try {
            const currenciesList = await this.CurrencyService.listSupportedCurrencies();

            return res.status(200).json({ message: `success`, data: currenciesList });
        } catch (err) { 
            return res.status(500).json({ message: 'internal server error' });
        }
    }
    
    store (req, res) {
        try {
            const newCurrency = this.CurrencyService.addCurrency(req.body);
            
            return res.status(200).json({ message: 'success', data: newCurrency });
        } catch (err) {
            return res.status(500).json({ message: 'internal server error' });
        }
    }

    delete(req, res) {
        return res.send(`currency ${req.params.symbol} deleted`);
    }
};