const CoinService = require('./services/CoinService');
const updateCoinValidator = require('./validator/update-coin');
const addCoinValidator = require('./validator/add-coin');
const removeCoinValidator = require('./validator/remove-coin');
const getCoinValidator = require('./validator/get-coin');
class CoinController {
    constructor() {
        this.coinService = new CoinService();
    }

    async addCoin(req, res, next) { // updateCoin
        try {
            const { body } = req;

            const validBody = addCoinValidator.validate(body);

            if (!validBody.error) {
                const response = await this.coinService.addCoin(body.ticket, body.currency);

                res.send(200, response);
            } else {
                const errorReason = validBody.error.details[0].message;
                res.send(400, {mensagem: 'Parâmetros obrigatórios não enviados', reason: errorReason })
            }  
        } catch (e) {
            res.send(500, { mensagem: 'Ocorreu um erro ao executar a criação da moeda.' })
        }

        return next();
    }

    async updateCoin(req, res, next) {
        try {
            const { body } = req;

            const validBody = updateCoinValidator.validate(body);

            if (!validBody.error) {
                const response = await this.coinService.updateCoin(body.ticket, body.newTicket, body.currency);

                res.send(200, response);
            } else {
                const errorReason = validBody.error.details[0].message;
                res.send(400, {mensagem: 'Parâmetros obrigatórios não enviados', reason: errorReason })
            }  
        } catch (e) {
            res.send(500, { mensagem: 'Ocorreu um erro ao executar a atualização da moeda' })
        }

        return next();
    }

    async deleteCoin(req, res, next) {
        try {
            const { query } = req;

            const validQuery = removeCoinValidator.validate(query);

            if (!validQuery.error) {
                const response = await this.coinService.delete(query.ticket);

                res.send(200, response);
            } else {
                const errorReason = validQuery.error.details[0].message;
                res.send(400, {mensagem: 'Parâmetros obrigatórios não enviados', reason: errorReason })
            }  
        } catch (e) {
            console.log(e);
            res.send(500, { mensagem: 'Ocorreu um erro ao executar a exclusão da moeda.' })
        }

        return next();
    }

    async getCoin(req, res, next) {
        try {
            const { query } = req;

            const validQuery = getCoinValidator.validate(query);

            if (!validQuery.error) {
                const response = await this.coinService.getCoin(query.ticket);

                res.send(200, response);
            } else {
                const errorReason = validQuery.error.details[0].message;
                res.send(400, {mensagem: 'Parâmetros obrigatórios não enviados', reason: errorReason })
            }  
        } catch (e) {
            console.log(e);
            res.send(500, { mensagem: 'Ocorreu um erro ao recuperar a moeda.' })
        }

        return next();
    }
}


module.exports = CoinController;