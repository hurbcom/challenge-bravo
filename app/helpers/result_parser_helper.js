const resultParserHelper = (request, calculateResult) => {
  const responseObj = {
    date: new Date().toISOString().split('T')[0],
    from: request.from,
    to: request.to,
    amount: request.amount,
    converted: calculateResult,
  };

  return responseObj;
};

module.exports = resultParserHelper;
