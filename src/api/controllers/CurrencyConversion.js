export default class CurrencyConvertion {
    constructor () {
        // -
    }
    
    list (req, res) {
        return res.sendResponse(200, `${req.query.amount} ${req.query.from} converted to ${req.query.to} is N`);
    }
};