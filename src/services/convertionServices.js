const baseCurrencyConvertion = require("../util/convertionUtil");

const convert = async (from, to, amount = 1) => {
    let fromQuote = await baseCurrencyConvertion(from);
    let ToQuote = await baseCurrencyConvertion(to);

    return (fromQuote / ToQuote) * amount;
};

module.exports = {
    convert,
};
