import conversion_validator from "../validators/validate_conversion.js";
import exchangeService from '../services/exchangeService.js';
import logger from '../config/logger.config.js';

class ExchangeController{
    static async exchange(req, res) {
        try {
            logger.info('----------> EXCHANGECONTROLLER SEND A DATA FROM INPUT TO BE CONVERTED ');

            const query = req.query;

            await conversion_validator.validate(query);

            const datasFromInput = [query.from, query.to, query.rate]; 

            const result = await exchangeService.exchangeService( datasFromInput )

            res.json(result)
        } catch(e) {
            logger.error(`############ CURRENCYREPOSITORES ${e.message}`);

            res.status(500).send({error: e.message})
        }
    }
}

export default ExchangeController;