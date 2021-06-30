import Message from '../../libs/ResMessage';

export default class Currency {
    constructor (CurrencyService) {
        this.CurrencyService = CurrencyService;
    }

    async list (req, res) {
        try {
            const currenciesList = await this.CurrencyService.listSupportedCurrencies();
            const resMessage = Message.success({ data: { list: currenciesList } });

            return res.sendResponse(resMessage);
        } catch (err) {
            const errMessage = Message.internalError();

            return res.sendResponse(errMessage);
        }
    }
    
    async store (req, res) {
        try {
            const newCurrency = await this.CurrencyService.storeCurrency(req.body);
            const resMessage = Message.successCreated({ data: newCurrency });
            
            return res.sendResponse(resMessage);
        } catch (err) {
            let errMessage = Message.internalError();

            if (err.already_registered) {
                errMessage = Message.unprocessableEntity({ message: 'This currency is already registered' });
            }

            return res.sendResponse(errMessage);
        }
    }

    async delete(req, res) {
        try {
            const deletedCurrency = await this.CurrencyService.deleteCurrency(req.params);
            const resMessage = Message.success({ data: deletedCurrency });
            
            return res.sendResponse(resMessage);
        } catch (err) {
            let errMessage = Message.internalError();

            if (err.not_found) {
                errMessage = Message.unprocessableEntity({ message: 'This currency is not registered' });
            }

            return res.sendResponse(errMessage);
        }
    }
};