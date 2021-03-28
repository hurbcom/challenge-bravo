const convertionService = require("../services/convertionServices");

const convertCurrency = async (req, res, next) => {
    try {
        let { from, to, amount } = req.query;

        let convertedAmount = await convertionService.convert(from, to, amount);
        res.status(200).json({
            data: {
                amount: convertedAmount,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    convertCurrency,
};
