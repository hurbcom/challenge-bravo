const ExchangeService = require('./services/ExchangeService');
const currencyValidator = require('./validator/get-currency-validator');
class CurrencyController {
    constructor() {
        this.exchangeService = new ExchangeService();
    }

    async getCurrency(req, res, next) {
        try {
            const { query } = req;

            const validQuery = currencyValidator.validate(query);

            if (!validQuery.error) {
                const update_time = await this.exchangeService.checkUpdateTime();
                const response = await this.exchangeService.conversion(query.from, query.to, query.amount);

                res.send(200, { amount: response, currency: query.to, update_time });
            } else {
                const errorReason = validQuery.error.details[0].message;
                res.send(400, { mensagem: 'Parâmetros obrigatórios não enviados', reason: errorReason })
            }
        } catch (e) {
            res.send(500, { mensagem: 'Ocorreu um erro ao executar a conversão.', reason: e.message })
        }

        return next();
    }
}


module.exports = CurrencyController;