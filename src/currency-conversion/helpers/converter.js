const calcAmountByRates = (rates, amount) => {
  const amountObj = {};
  Object.keys(rates).forEach((coin) => {
    amountObj[coin] = rates[coin] * amount;
  });
  return amountObj;
};


module.exports = {
  calcAmountByRates,
};
