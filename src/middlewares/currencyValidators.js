const validateBeforeAddCurrency = (req, res, next) => {
    const { currencyName } = req.body;
    if(!currencyName || currencyName.length > 4) {
        return res.status(422).json("You must provide a valid currency name (up to 4 characters).")
    }

    req.body.currencyName = currencyName.toUpperCase();

    next();
};

const validateBeforeConvert = (req, res, next) => {
    const { from, to, amount } = req.query;

    if(!from) {
        return res.status(422).json({ "message" : "You must provide a 'from' currency." });
    }
    
    if(!to) {
        return res.status(422).json({ "message" : "You must provide a 'to' currency." });
    }

    if(!available_currencies.includes(from)) {
        return res.status(422).json({ "message" : `The currency ${from} is not available in our system.` });
    }

    if(!available_currencies.includes(to)) {
        return res.status(422).json({ "message" : `The currency ${to} is not available in our system.` });
    }

    if(!amount) {
        return res.status(422).json({ "message" : "You must provide a 'amount' to be converted." });
    }

    if(!parseFloat(amount) || parseFloat(amount) <= 0) {
        return res.status(422).json({ "message" : "You must provide a valid 'amount' (number greater than zero)." }, );
    }
 
    next();
};

module.exports = {
    validateBeforeConvert,
    validateBeforeAddCurrency
};