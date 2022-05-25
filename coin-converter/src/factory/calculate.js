
exports.conversion = (quoteFrom, value, quoteTo) => {
    const valueInUSD = quoteFrom * value
    const valueTo = valueInUSD / quoteTo
    return valueTo
}