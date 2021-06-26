import Message from '../../libs/ResMessage';

export default class CurrencyConversion {
    constructor (CurrencyService) {
        this.CurrencyService = CurrencyService;
    }
    
    async list (req, res) {
        try {
            const convertedAmount = await this.CurrencyService.convertAmount(req.params);
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