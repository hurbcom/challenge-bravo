export default class CurrencyConvertion {
    constructor () {
        // -
    }
    
    list (req, res) {
        return res.send(`${req.query.amount} ${req.query.from} converted to ${req.query.to} is N`);
    }
};