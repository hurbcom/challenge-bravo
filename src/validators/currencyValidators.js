const validateBeforeConvert = (req, res, next) => {
    const { from, to, amount } = req.query;
    if(!from) {
        return res.status(422).json({ "message" : "You must provide a 'from' currency." });
    }
    
    if(!to) {
        return res.status(422).json({ "message" : "You must provide a 'to' currency." });
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
    validateBeforeConvert
};