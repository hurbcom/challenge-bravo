export default class Currency {
    constructor () {
        // -
    }
    
    list (req, res) {
        return res.send(`a list of all currencies`);
    }

    store (req, res) {
        return res.send(`currency ${req.body.symbol} added with a quitation of ${req.body.quotation}`);
    }

    delete(req, res) {
        return res.send(`currency ${req.params.symbol} deleted`);
    }
};