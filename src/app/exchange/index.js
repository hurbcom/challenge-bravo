const exchangeController = require('./controller');
const ExchangeService = require('./service');

module.exports = router => {
  const service = new ExchangeService();
  return exchangeController(router, service)
}