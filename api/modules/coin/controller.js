const CoinService = require('./services/CoinService');
const currencyValidator = require('./validator/get-currency-validator');
class CurrencyController {
    constructor() {
        this.coinService = new CoinService();
    }

    async getCurrency(req, res, next) {
        try {
            const { query } = req;

            const validQuery = currencyValidator.validate(query);

            if (!validQuery.error) {
                const response = await this.coinService.conversion(query.from, query.to, query.amount);

                res.send(200, response);
            } else {
                const errorReason = validQuery.error.details[0].message;
                res.send(400, {mensagem: 'Parâmetros obrigatórios não enviados', reason: errorReason })
            }  
        } catch (e) {
            res.send(500, { mensagem: 'Ocorreu um erro ao executar a conversão.' })
        }

        return next();
    }
}


module.exports = CurrencyController;