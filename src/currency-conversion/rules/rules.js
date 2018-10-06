const ruleHasAllParams = (req, res, next) => {
  const { from, to, amount } = req.query;
  const hasAllParams = !!(from && to && amount);
  if (hasAllParams) next();
  else res.sendStatus(412);
};

const ruleFromAndToAreValid = (req, res, next) => {
  const { from, to } = req.query;
  const coins = ['USD', 'BRL', 'EUR', 'BTC', 'ETH'];
  if (coins.includes(from) && coins.includes(to)) next();
  else res.sendStatus(400);
};

const ruleAmountIsNumber = (req, res, next) => {
  const { amount } = req.query;
  const isNumber = a => !Number.isNaN(a);
  if (isNumber(amount)) next();
  else res.sendStatus(400);
};


module.exports = [
  ruleHasAllParams,
  ruleFromAndToAreValid,
  ruleAmountIsNumber,
];
