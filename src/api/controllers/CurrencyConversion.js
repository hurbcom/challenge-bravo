import Message from '../../libs/ResMessage';

export default class CurrencyConvertion {
    constructor () {
        // -
    }
    
    list (req, res) {
        const resMessage = Message.success({ message: `${req.query.amount} ${req.query.from} converted to ${req.query.to} is N` });
        
        return res.sendResponse(resMessage);
    }
};