module.exports = (from, to, data) => {
    const fromCurrencyUSD = 1/data[from]; //From Currency -> Dolar
    const toCurrencyUSD = 1/data[to]; //To Currency -> Dolar

    return toCurrencyUSD/fromCurrencyUSD; //Going to right base.

}