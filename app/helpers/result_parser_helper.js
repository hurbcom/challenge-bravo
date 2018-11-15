const resultParserHelper = (request, calculateResult) => {
  const responseObj = {
    date: new Date(),
    from: request.from,
    to: request.to,
    amount: request.amount,
    converted: calculateResult,
  };

  return responseObj;
};

module.exports = resultParserHelper;
