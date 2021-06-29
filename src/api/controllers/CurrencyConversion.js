import Message from '../../libs/ResMessage';

export default class CurrencyConversion {
    constructor (CurrencyService) {
        this.CurrencyService = CurrencyService;
    }
    
    async list (req, res) {
        try {
            const { from, to, amount } = req.query;

            const convertedAmount = await this.CurrencyService.convertsAmountBetweenCurrencies(from, to, +amount);

            const resMessage = Message.success({ data: convertedAmount });
            
            return res.sendResponse(resMessage);
        } catch (err) {
            let errMessage = Message.internalError();

            if (err.unknow_source) {
                errMessage = Message.unprocessableEntity({ message: "Invalid conversion: currencies' codes are unknown" });
            }

            return res.sendResponse(errMessage);
        }
    }
};