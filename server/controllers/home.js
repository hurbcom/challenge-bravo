const logger = require('../services/logger');

module.exports = app => {
    app.get('/', (req, res, next) => {
        const oxrClient = new app.server.services.OxrClient();
        oxrClient.currencies((errors, request, response, object) => {
            if (errors) {
                logger.info(`Encontrado erros ao buscar as moedas: ${errors}`);
                return res.status(422).json({ errors: errors });
            }
            res.render('home', { amount: {}, from: {}, to: {}, currencies: Object.keys(object), convertion: {} });
        });
    });
}
