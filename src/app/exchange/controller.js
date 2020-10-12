const exchangeController = (router, service) => {

  return router.get('/', ctx => {
    const from = ctx.query['from'];
    const to = ctx.query['to'];
    const amount = ctx.query['amount']

    const value = service.calculate(from, to, parseFloat(amount));

    ctx.body = {
      value
    };
  });
}

module.exports = exchangeController;