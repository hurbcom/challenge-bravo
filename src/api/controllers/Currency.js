export default class Currency {
    constructor (CurrencyService) {
        this.CurrencyService = CurrencyService;
    }

    list (req, res) {
        try {
            const currenciesList = this.CurrencyService.listSupportedCurrencies();

            return res.status(200).json({ message: `success`, data: currenciesList });
        } catch (err) { 
            return res.status(500).json({ message: 'internal server error' });
        }
    }

    store (req, res) {
        return res.send(`currency ${req.body.symbol} added with a quitation of ${req.body.quotation}`);
    }

    delete(req, res) {
        return res.send(`currency ${req.params.symbol} deleted`);
    }
};