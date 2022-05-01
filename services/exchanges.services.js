exports.convert = (fromCurrency, toCurrency, amount) => {
    const result = amount * (toCurrency.rate / fromCurrency.rate);
    return result;
};
