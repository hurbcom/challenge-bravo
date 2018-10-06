const { COINS } = require('../constants');


const ruleHasAllParams = (req, res, next) => {
  const { from, to, amount } = req.query;
  const hasAllParams = !!(from && to && amount);
  if (hasAllParams) next();
  else res.sendStatus(412);
};

const ruleFromAndToAreValid = (req, res, next) => {
  const { from, to } = req.query;
  const coinsCodes = COINS.map(({ code }) => code);
  if (coinsCodes.includes(from) && coinsCodes.includes(to)) next();
  else res.sendStatus(400);
};

const ruleAmountIsNumber = (req, res, next) => {
  const { amount } = req.query;
  const isNumber = a => !isNaN(a); // eslint-disable-line no-restricted-globals
  if (isNumber(amount)) next();
  else res.sendStatus(400);
};


module.exports = [
  ruleHasAllParams,
  ruleFromAndToAreValid,
  ruleAmountIsNumber,
];
